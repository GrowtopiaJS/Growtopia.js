module.exports = function(main, packet, peerid, p) {
  main.Packet.sendPlayerLeave(peerid);
  main.Packet.requestWorldSelect(peerid);
  main.Packet.sendSound(peerid, "audio/door_shut.wav", 0);
}; 
