module.exports = function(main, packet, peerid, p) {
  let player = main.players.get(peerid);
  player.currentWorld = 'EXIT';

  if (player) {
    main.playersDB.set(player.rawName, player);
    player.hasClothesUpdated = false;

    if (main.Host.checkIfConnected(peerid)) {
      main.Packet.sendQuit(peerid);
    }
  }

  main.players.delete(peerid);
};
