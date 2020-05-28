module.exports = {
  name: 'gems',
  requiredPerms: 1,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let gems = arguments[0] || 0;
    gems = parseInt(gems);

    if (gems > 2147483647 || player.gems > 2147483647) {
      p.create()
        .string('OnConsoleMessage')
        .string('Too much gems.')
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      return p.reconstruct();
    }

    player.gems += gems;
    main.players.set(peerid, player);

    p.create()
      .string('OnSetBux')
      .int(player.gems)
      .int(0)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  }
};
