const PlayerInfo = require('../structs/PlayerInfo');
const Constants = require('../structs/Constants');
const crypto = require('crypto');

module.exports = function(main, packet, peerid, p) {
  let type = packet.get('dialog_name');

  switch(type) {
    case 'register': {
      let player = main.players.get(peerid);
      if (!player.isGuest) {
        p.create()
          .string('OnConsoleMessage')
          .string('You cannot make an account with a registered id.')
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      if (!packet.has('username') ||
        !packet.has('password') ||
        !packet.has('email') ||
        !packet.get('email').match(/\w+@\w+.\w+/g)) {
        p.create()
          .string('OnConsoleMessage')
          .string('Some of the info given is invalid, please try again.')
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      let username = packet.get('username');
      let password = packet.get('password');
      let email = packet.get('email');

      if (username.match(/\W+/g) && username.match(/\W+/g).length > 0) {
        p.create()
          .string('OnConsoleMessage')
          .string('Username cannot be empty or contain symbols.')
          .end()

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      if (main.playersDB.has(username.toLowerCase())) {
        p.create()
          .string('OnConsoleMessage')
          .string('An account with this username already exists.')
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      let newPlayer = new PlayerInfo();
      for (let key of Object.keys(player)) {
        newPlayer[key] = player[key];
      }

      newPlayer.tankIDName = username;
      newPlayer.tankIDPass = crypto.createHmac('sha256', main.secret).update(password).digest('hex');
      newPlayer.requestedName = "";
      newPlayer.displayName = username;
      newPlayer.properName = username;
      newPlayer.email = email;
      newPlayer.rawName = username.toLowerCase();
      newPlayer.states = [];
      newPlayer.temp = {};
      newPlayer.isGuest = false;

      main.playersDB.set(newPlayer.rawName, newPlayer);
      p.create()
        .string('OnConsoleMessage')
        .string('`2Successfully registered.')
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      p.reconstruct();

      p.create()
        .string('SetHasGrowID')
        .int(1)
        .string(username)
        .string(password)
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      p.reconstruct();

      main.Packet.sendQuit(peerid, true);

      break;
    }

    case 'editPlayer': {
      // soon
      break;
    }

    default: {
      console.log(`Unhandled dialog: ${type}`);
      break;
    }
  }
};
