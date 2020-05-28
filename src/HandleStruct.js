const Constants = require('./structs/Constants');

module.exports = function(main, packet, peerid, p) {
  const type = main.Packet.GetStructPointerFromTankPacket(packet);
  const data = main.Packet.unpackPlayerMoving(packet);

  let tank = Object.entries(Constants.tankPackets);
  tank = tank.filter(i => i[1] === type)[0];

  if (!tank) return;

  main.tanks.get(tank[0])(main, packet, peerid, p, type, data);
};