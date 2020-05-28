module.exports = {
  name: 'sb',
  requiredPerms: 1,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let world = main.worlds.get(player.currentWorld);
    let worldName = player.roles.includes('mod') || player.roles.includes('admin') ? '4JAMMED!' : `$${world.name}`;
    let playerName = player.id === world.owner.id ?  `\`2${player.displayName}` : `\`w${player.displayName}`;

    if (arguments.length < 1) return;

    p.create()
      .string('OnConsoleMessage')
      .string(`CP:0_PL:4_OID:_CT:[SB]_ \`5** from (${playerName}\`\`\`\`\`5) in [\`\`\`${worldName}\`\`\`5] ** : \`\`\`$${arguments.join(' ')}\`\``)
      .end();

    main.Packet.broadcast(function(peer) {
      main.Packet.sendPacket(peer, p.return().data, p.return().len);
      main.Packet.sendSound(peer, "audio/beep.wav", 0);
    });

    p.reconstruct();
  }
};
