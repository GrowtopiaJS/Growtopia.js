const Constants = require('../structs/Constants');

module.exports = {
  name: 'nick',
  requiredPerms: 4,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let nick = arguments.join(' ');

    if (!nick.match(/^[a-zA-Z0-9]+$/g) && nick.length > 0) {
      p.create()
        .string('OnConsoleMessage')
        .string('Nicknames cannot contain symbols.')
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      return p.reconstruct();
    }

    if (nick.length < 1) {
      nick = player.isGuest ? `${peerid}_${player.requestedName}` : player.registeredName;

      let isMod = player.permissions & Constants.Permissions.mod;
      let isAdmin = player.permissions & Constants.Permissions.admin;

      if (isMod > 0 && isAdmin === 0)
        nick = '`#@' + nick;
      else if (isAdmin > 0)
        nick = '`6@' + nick;
    } 

    player.displayName = nick;

    p.create()
      .string('OnConsoleMessage')
      .string(`Changed your nickname to \`w${nick}`)
      .end();

    if (player.worldsOwned.includes(player.currentWorld))
      nick = `\`2${nick}`;

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();

    main.Packet.setNickname(peerid, nick)
  }
};
