const PlayerInfo = require('./structs/PlayerInfo');
const PacketCreator = require('./PacketCreator');
const Constants = require('./structs/Constants');
const HandleStruct = require('./HandleStruct');
const HandleActions = require('./HandleActions');
const crypto = require('crypto');

let p = new PacketCreator();

module.exports = {
  onConnect: function(main, peerid) {
    main.emit('connect', peerid);
    const data = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00]).toString();

    // send hello packet
    main.Packet.sendStringPacket(peerid, data);
  },

  onDisconnect: function(main, peerid) {
    main.emit('disconnect', peerid);
    if (main.players.has(peerid))
      main.players.delete(peerid);
    let player = main.disconnects.get(peerid);

    if (!main.Host.checkIfConnected(peerid)) {
      if (player) {
        main.players.forEach(player2 => {
          if (peerid !== player2.temp.peerid && player2.tankIDName === player.tankIDName) {
            player.netID = player2.netID;
            player.states = [];
            player.temp.peerid = player2.temp.peerid;
            player.temp.MovementCount = 0;
            main.players.set(player2.temp.peerid, player)
          }
        });
      }

      main.Packet.sendPlayerLeave(peerid);
    }
  },

  onReceive: async function(main, packet, peerid) {
    const packetType = main.GetPacketType(packet);
    const dataMap = new Map();

    if (packetType === 2 || packetType === 3) {
      const decodedPacket = main.GetMessage(packet);
      let split = decodedPacket.split('\n');

      for (let i = 0; i < split.length; i++) {
        let vsplit = split[i];
        if (vsplit.startsWith('|')) {
           vsplit = vsplit.substring(1);
        }

        let value = vsplit.split('|')[1];

        if (value) {
          let index = value.indexOf('\0')
          if (index > -1)
            value = value.substr(0, index);

          dataMap.set(vsplit.split('|')[0], value.trim())
        }
      }

      main.emit('receive', dataMap, peerid);

      if (dataMap.has('action') && main.Host.checkIfConnected(peerid)) {
        HandleActions(main, dataMap, peerid, p);
      }

      // Account handling

      if (dataMap.has('requestedName') || dataMap.has('tankIDName')) {
        let user = dataMap.get('tankIDName')
        if (dataMap.has('tankIDName')) {
          user = user.toLowerCase();
          let errorMsg = '`4Unable to log on:`o That `wGrowID `odoesn\'t seem valid, or the password is wrong. If you don\'t have one, press `wCancel`o, un-check `w\'I have a GrowID\'`o, then click `wConnect`o.';
          // logged in as account
          if (!(await main.playersDB.has(user)) || !dataMap.has('tankIDPass')) {
            // no account found
            p.create()
              .string('OnConsoleMessage')
              .string(errorMsg)
              .end();

            main.Packet.sendPacket(peerid, p.return().data, p.return().len);
            main.Packet.sendQuit(peerid);
            return p.reconstruct();
          } else {
            let password = (await main.playersDB.get(user)).tankIDPass;
            let hmac = crypto.createHmac('sha256', main.secret);

            let inputPass = hmac.update(dataMap.get('tankIDPass')).digest('hex');

            if (password !== inputPass) {
              p.create()
                .string('OnConsoleMessage')
                .string(errorMsg)
                .end();

              main.Packet.sendPacket(peerid, p.return().data, p.return().len);
              main.Packet.sendQuit(peerid);
              return p.reconstruct();
            }
          };

          p.create()
            .string('SetHasGrowID')
            .int(1)
            .string(dataMap.get('tankIDName'))
            .string(dataMap.get('tankIDPass'))
            .end()

          main.Packet.sendPacket(peerid, p.return().data, p.return().len);
          p.reconstruct();
        } else {
          // no growid
          p.create()
            .string('OnConsoleMessage')
            .string('This is a Guest account where almost everything can\'t be used.')
            .end();

          main.Packet.sendPacket(peerid, p.return().data, p.return().len);
          p.reconstruct();

          p.create()
            .string('SetHasGrowID')
            .int(0)
            .string(dataMap.get('tankIDName') || '')
            .string(dataMap.get('tankIDPass') || '')
            .end();

          main.Packet.sendPacket(peerid, p.return().data, p.return().len);
          p.reconstruct();
        };

        let player;
        let fromDb = false;
        let fromDiscon = false;

        user = user || dataMap.get('requestedName');
        if (main.playersDB.has(user)) {
          fromDb = true;
          player = main.playersDB.get(user);
        } else {
          player = new PlayerInfo(main);
        };

        if (fromDb) {
          let _= new PlayerInfo(main);

          for (let keys of Object.keys(player)) {
            _[keys] = player[keys];
          }

          player = _;
          delete _;
        }

        let keys = Object.keys(player);

        for (let i = 0; i < keys.length; i++) {
          player[keys[i]] = dataMap.get(keys[i]) || player[keys[i]];
        }

        let hmac = crypto.createHmac('sha256', main.secret);

        main.netID++;
        player.netID = main.netID;
        player.displayName = player.tankIDName || `${peerid}_${player.requestedName}`;
        player.properName = player.tankIDName || player.requestedName;
        player.rawName = player.properName.toLowerCase();
        player.isGuest = !player.tankIDName && player.requestedName ? true : false;
        player.ip = main.Host.getIP(peerid);
        player.temp.peerid = peerid;
        player.tankIDPass = player.tankIDPass.length > 0 ? hmac.update(player.tankIDPass).digest('hex') : '';
        player.states = [];
        player.hasClothesUpdated = false;
        player.permissions = player.isGuest ? 0 : (player.permissions === 0 ? 1 : player.permissions)

        if (player.roles.length < 1) {
          if (player.permissions === 0 || player.permissions < 0) {
            player.roles.push('guest');
          };

          for (let perm of Object.keys(Constants.Permissions)) {
            if (player.permissions === 0 || player.permissions < 0) continue;
            let calculatedPerm = player.permissions & Constants.Permissions[perm];

            if (player.roles.includes(perm))
              continue;

            if (calculatedPerm || perm === 'user')
              player.roles.push(perm);
          }
        }

        let isMod = player.permissions & Constants.Permissions.mod;
        let isAdmin = player.permissions & Constants.Permissions.admin;

        if (isMod > 0 && isAdmin === 0)
           player.displayName = '`#@' + player.displayName;
        else if (isAdmin > 0)
          player.displayName = '`6@' + player.displayName;

        for (let [peer, currentPlayer] of main.players) {
          if (main.Host.checkIfConnected(peer)) {
            if (currentPlayer.temp.peerid === player.temp.peerid)
              continue;

            if (player.tankIDName && player.tankIDName === currentPlayer.tankIDName) {

              p.create()
                .string('OnConsoleMessage')
                .string('Someone is already logged in on your account. Kicking it so you can log on.')
                .end();

              main.Packet.sendPacket(peerid, p.return().data, p.return().len);
              p.reconstruct();

              p.create()
                .string('OnConsoleMessage')
                .string('Kicking you out as somebody is trying to login')
                .end();

              main.Packet.sendPacket(peer, p.return().data, p.return().len);
              p.reconstruct();

              main.Packet.sendQuit(peer);

              fromDiscon = true;

              if (currentPlayer.currentWorld)
                main.Packet.sendPlayerLeave(peer);

              main.disconnects.set(peer, currentPlayer);
              main.players.delete(peer);
            }
          }
        }

        main.players.set(peerid, player);

        p.create()
          .string('OnSuperMainStartAcceptLogonHrdxs47254722215a')
          .int(main.itemsDatHash)
          .string('ubistatic-a.akamaihd.net')
          .string(main.cdn)
          .string('cc.cz.madkite.freedom org.aqua.gg idv.aqua.bulldog com.cih.gamecih2 com.cih.gamecih com.cih.game_cih cn.maocai.gamekiller com.gmd.speedtime org.dax.attack com.x0.strai.frep com.x0.strai.free org.cheatengine.cegui org.sbtools.gamehack com.skgames.traffikrider org.sbtoods.gamehaca com.skype.ralder org.cheatengine.cegui.xx.multi1458919170111 com.prohiro.macro me.autotouch.autotouch com.cygery.repetitouch.free com.cygery.repetitouch.pro com.proziro.zacro com.slash.gamebuster')
          .string('proto=84|choosemusic=audio/mp3/about_theme.mp3|active_holiday=0|server_tick=226933875|clash_active=0|drop_lavacheck_faster=1|isPayingUser=0|')
          .end();

        if (fromDiscon) {
          setTimeout(() => {
            let player = main.players.get(peerid);
            for (let [oldPeer, oldPlayer] of main.disconnects) {
              if (oldPlayer.tankIDName === player.tankIDName) {

                oldPlayer.netID = player.netID;
                oldPlayer.temp.peerid = peerid;
                oldPlayer.temp.MovementCount = 0;
                oldPlayer.states = [];

                main.players.set(peerid, oldPlayer);
                main.disconnects.delete(oldPeer)
              } else continue;
            }
            main.Packet.sendPacket(peerid, p.return().data, p.return().len);
            p.reconstruct();
          }, 1500);
        } else {
          main.Packet.sendPacket(peerid, p.return().data, p.return().len);
          p.reconstruct();
        }
      }
    } else if (packetType === 4) {
      HandleStruct(main, packet, peerid, p);
    }
  }
};
