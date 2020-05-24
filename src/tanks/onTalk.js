module.exports = function(main, packet, peerid, p, type, data) {
  main.Packet.sendPData(peerid, data);
}