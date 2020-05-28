module.exports = {
  name: 'info',
  requiredPerms: 1,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let msg = `Your Info:\n`;
    let keys = Object.keys(player);

    for (let playerData of keys) {
      if (playerData === 'temp')
        continue;

      msg += `\`o${playerData}: \`w${player[playerData]}\`o${keys.indexOf(playerData) === keys.length - 1 ? '' : '\n'}`;
    }

    p.create()
      .string('OnConsoleMessage')
      .string(msg)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  }
};
