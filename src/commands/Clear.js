const Constants = require('../structs/Constants');

module.exports = {
  name: 'clear',
  requiredPerms: 2,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    if (!arguments[0]) return;

    if (arguments[0].toLowerCase() === 'world') {
      // clear world
      let world = main.worlds.get(player.currentWorld);
      let check = 0;

      for (let i = 0; i < world.items.length; i++) {
        let item = main.getItems().get(world.items[i].foreground || world.items[i].background);
        if (item.actionType === Constants.Blocktypes.locks || item.actionType === Constants.Blocktypes.weather) continue; // ignore weather and locks

        if (world.items[i].foreground === 6 || world.items[i].foreground === 8) continue;
        if (world.items[i].foreground === 0 && world.items[i].background === 0) continue;

        check++;
      }

      if (check < 1) {
        p.create()
          .string('OnConsoleMessage')
          .string('World already cleared.')
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      for (let i = 0; i < world.items.length; i++) {
        let item = main.getItems().get(world.items[i].foreground || world.items[i].background);
        
        if (item.actionType === Constants.Blocktypes.locks || item.actionType === Constants.Blocktypes.weather) continue; // ignore weather and locks
        if ((world.items[i].foreground === 6 && world.items[i].background === 0) || world.items[i].foreground === 8) continue;

        if (world.items[i].foreground === 6) {
          world.items[i].background = 0;
          continue;
        }

        world.items[i].foreground = 0;
        world.items[i].background = 0;
      }

      main.worlds.set(player.currentWorld, world);
      let players = world.players;

      for (let worldPlayer of players) {
        if (!main.Host.checkIfConnected(worldPlayer.temp.peerid)) continue;

        p.create()
          .string('OnConsoleMessage')
          .string('World was magically cleared.')
          .end();

        main.Packet.sendPacket(worldPlayer.temp.peerid, p.return().data, p.return().len);
        p.reconstruct();

        main.Packet.sendPlayerLeave(worldPlayer.temp.peerid);
        main.Packet.requestWorldSelect(worldPlayer.temp.peerid);
      }
    }
  }
};
