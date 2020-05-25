module.exports = function(main, packet, peerid, p) {
  let player = main.players.get(peerid);
  let color = parseInt(packet.get('color'));

  player.skinColor = color;
  main.players.set(peerid, player);

  main.Packet.updateAllClothes(peerid);
}