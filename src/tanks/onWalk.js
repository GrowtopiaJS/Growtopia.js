const Constants = require('../structs/Constants');

module.exports = function(main, packet, peerid, p, type, data) {
  let player = main.players.get(peerid);
  let world = main.worlds.get(player.currentWorld);
  player.x = Math.floor(data.x);
  player.y = Math.floor(data.y);

  player.temp.MovementCount++;
  if (player.temp.MovementCount < 2) {
    if (world && world.owner.id === player.id)
      main.Packet.setNickname(peerid, `\`2${player.displayName}`);

    main.Packet.broadcast(function(peer) {
      let clothes = Object.values(player.clothes);
      let haveDoubleJump = 0;

      for (let i = 0; i < clothes.length; i++) {
        if (Constants.wings.includes(clothes[i]))
          haveDoubleJump = 1;    
      }

      if (haveDoubleJump) {
        player.addState('canDoubleJump')
        return main.Packet.sendState(peerid);
      }
    }, {
      sameWorldCheck: true,
      world: player.currentWorld,
      peer: peerid,
      runIfNotSame: true,
      runFunctionFirst: true
    });

    main.Packet.broadcast(function(peer) {
      main.Packet.sendState(peer);
    }, {
      sameWorldCheck: true,
      world: player.currentWorld,
      peer: peerid,
      runIfNotSame: true
    });
  }

  main.players.set(peerid, player);
  main.Packet.sendPData(peerid, data);

  if (!player.hasClothesUpdated) {
    player.hasClothesUpdated = true;
    main.players.set(peerid, player);
    main.Packet.updateAllClothes(peerid);
    main.Packet.sendState(peerid);
  }
}