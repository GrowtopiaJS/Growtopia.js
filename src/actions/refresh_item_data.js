module.exports = function(main, packet, peerid) {
  main.Packet.sendPacket(peerid, main.itemsDat, main.itemsDat.length);
};
