module.exports = {
  name: 'weather',
  requiredPerms: 2,
  run: function(main, arguments, peerid, p) {
    let weather = arguments[0];

    if (!weather)
      weather = 0;

    weather = parseInt(weather);
    p.create()
      .string('OnSetCurrentWeather')
      .int(weather)
      .end();

    main.Packet.broadcast(function(peer) {
      main.Packet.sendPacket(peer, p.return().data, p.return().len);
    }, {
      sameWorldCheck: true,
      peer: peerid
    });

    p.reconstruct();
  }
};
