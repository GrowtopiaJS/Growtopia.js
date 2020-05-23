module.exports = {
  name: 'sb',
  requiredPerms: 2,
  run: function(main, args, peerid, p) {
    const sber = main.players.get(peerid);

    if (!args.length) return;

    for (let i = 0; i < main.players.length; i++) {
      let player = main.players[i];
      p.create()
        .string('OnConsoleMessage')
        .string(`CP:0_PL:4_OID:_CT:[SB]_ \`w** \`#Super Broadcast\`w from ${sber.displayName}\`w (in \`o${sber.currentWorld}\`w) **: \`#${args.join(" ")}`)
        .end();

      main.Packet.sendPacket(player.temp.peerid, p.return().data, p.return().len);
      return p.reconstruct();
    })
  }
};
