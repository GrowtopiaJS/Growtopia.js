const Constants = require('../structs/Constants');

module.exports = {
  name: 'legend',
  requiredPerms: 1,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let nick;

    if (player.isLegend) {
      nick = player.displayName.slice(0, " of Legend``".length - 3);
      player.isLegend = false;
    } else {
      nick = `${player.displayName} of Legend\`\``
      player.isLegend = true;

      main.Packet.sendSound(peerid, "audio/choir.wav", 0);
    };

    player.displayName = nick;

    p.create()
      .string('OnTalkBubble')
      .intx(player.netID)
      .string(`${player.isLegend ? '\`2Enabled' : '\`4Disabled'}\`\` Legend\`\` title.`)
      .intx(0)
      .intx(1)
      .end();

    if (player.worldsOwned.includes(player.currentWorld))
      nick = `\`2${nick}`;

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();

    main.Packet.setNickname(peerid, nick);
  }
};
