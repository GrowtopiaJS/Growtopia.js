module.exports = function(main, packet, peerid, p) {
  let text = packet.get('text');
  let player = main.players.get(peerid);
  let world = main.worlds.get(player.currentWorld);

  if (text.trim().length > 0) {
    let msg = "";

    if (text.startsWith('/')) {
      let arguments = text.slice(1).split(/ +/g);
      let command = arguments.shift().toLowerCase();

      if (main.commands.has(command)) {
        let cmd = main.commands.get(command);
        if ((cmd.requiredPerms & player.permissions) || cmd.requiredPerms === 0 || player.permissions > cmd.requiredPerms)
          return cmd.run(main, arguments, peerid, p);
        else {
          p.create()
            .string('OnConsoleMessage')
            .string(`Command \`4${command}\`o not found.`)
            .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
        }
      } else {
        p.create()
          .string('OnConsoleMessage')
          .string(`Command \`4${command}\`o not found.`)
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      };
    }

    if (player.roles.includes('mod') || player.roles.includes('admin'))
      msg += '`^';

    msg += text;
    msg = msg.trim().split(/ +/g).join(' ');

    let name = player.displayName;
    if (world.owner.id === player.id)
      name = `\`2${name}`;

    p.create()
      .create()
      .string('OnConsoleMessage')
      .string(`CP:0_PL:4_OID:_CT:[W]_ \`6<\`w${name}\`6> \`o${msg}`)
      .end();

    let p2 = p.new()
      .create()
      .string('OnTalkBubble')
      .intx(player.netID)
      .string(msg)
      .intx(0)
      .end()
      .return();

    main.Packet.broadcast(function(peer) {
      main.Packet.sendPacket(peer, p.return().data, p.return().len);
      main.Packet.sendPacket(peer, p2.data, p2.len);
    }, {
      sameWorldCheck: true,
      world: player.currentWorld,
      peer: peerid
    });
    
    p.reconstruct();
  }
};
