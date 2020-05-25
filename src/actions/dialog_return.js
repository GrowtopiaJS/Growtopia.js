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
      newPlayer.registeredName = username;

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

    case 'trash_item': {
      let player = main.players.get(peerid);
      let itemID = parseInt(packet.get('itemID'));
      let count = parseInt(packet.get('count'));
      let itemData = player.inventory.items.filter(i => i.itemID === itemID)[0];

      if (!itemData) return;

      if (count > itemData.itemCount) // just remove it
        player.inventory.items = player.inventory.items.filter(i => i.itemID !== itemID);

      if (count <= itemData.itemCount) {
        itemData.itemCount -= count;

        for (let i = 0; i < player.inventory.items.length; i++) {
          if (player.inventory.items[i].itemID === itemID)
            player.inventory.items[i].itemCount = itemData.itemCount;
        }
      }

      main.Packet.sendSound(peerid, "audio/trash.wav", 0);
      main.players.set(peerid, player);
      main.Packet.sendInventory(peerid);

      // remove from clothes if wearing and effect
      let trashedItem = player.inventory.items.filter(i => i.itemID === itemID)[0];
      let clothes = Object.entries(player.clothes);
      let item = main.getItems().get(itemID);

      if (!trashedItem) return;

      for (let i = 0; i < clothes.length; i++) {
        if (clothes[i][1] !== trashedItem.itemID || trashedItem.itemCount + 1 > 1) continue; // +1 because we already removed it from inventory

        if (trashedItem.itemID === 1904) // the one ring
          player.removeState('isInvis');

        if (Constants.wings.includes(trashedItem.itemID))
          player.removeState('canDoubleJump');

        if (Constants.ItemEffects[item.name] && player.punchEffects.includes(item.name))
          player.removePunchEffect(item.name);

        player.clothes[clothes[i][0]] = 0;
      }

      main.players.set(peerid, player);
      main.Packet.sendState(peerid);
      
      if (trashedItem.itemCount < 1)
        main.Packet.sendClothes(peerid);
      else main.Packet.sendClothes(peerid, true);

      break;
    }

    default: {
      console.log(`Unhandled dialog: ${type}`);
      break;
    }
  }
};
