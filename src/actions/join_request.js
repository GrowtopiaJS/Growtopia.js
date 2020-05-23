const Constants = require('../structs/Constants');

module.exports = function(main, packet, peerid, p) {
  if (!packet.get('name')) {
    p.create()
      .string('OnConsoleMessage')
      .string('Please give a proper world name.')
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();

    p.create()
      .string('OnFailedToEnterWorld')
      .intx(1)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    return p.reconstruct();
  }

  let player;
  let name = packet.get('name').toUpperCase();
  let world = main.worlds.get(name);

  if (world) {
    player = main.players.get(peerid);
    player.currentWorld = name

    world.players.push(player);
    main.worlds.set(name, world);

    main.players.set(peerid, player);

    main.Packet.sendWorld(peerid, world);
  } else {
    world = main.generateWorld(name, 100, 60);

    player = main.players.get(peerid);
    player.currentWorld = world.name

    main.players.set(peerid, player);

    world.players.push(player);
    main.worlds.set(name, world);

    main.Packet.sendWorld(peerid, world);
  };

  let x = 3040;
  let y = 736;

  for (let j = 0; j < world.width*world.height; j++) {
    if (world.items[j].foreground == 6) {
      x = (j % world.width) * 32;
      y = (j / world.width) * 31.6;
    }
  }

  player.x = Math.floor(x);
  player.y = Math.floor(y);

  main.players.set(peerid, player);

  if (player.id === world.owner.id)
    player.addRole('worldOwner');

  p.create()
    .string('OnSpawn')
    .string(`spawn|avatar\nnetID|${player.netID}\nuserID|${player.id}\ncolrect|0|0|20|30\nposXY|${x}|${y}\nname|\`\`${player.displayName}\`\`\ninvis|0\nmstate|0\nsmstate|0\ntype|local\n`)
    .end();

  main.Packet.sendPacket(peerid, p.return().data, p.return().len);
  p.reconstruct();

  main.Packet.onPeerConnect(peerid);
  main.Packet.sendInventory(peerid);
  main.Packet.sendSound(peerid, "audio/door_open.wav", 0);

  p.create()
    .string('OnConsoleMessage')
    .string(`World \`w${world.name} \`\`entered. The are \`w${world.players.length - 1}\`\` other people here, \`w${main.players.size}\`\` online.`)
    .end();

  main.Packet.sendPacket(peerid, p.return().data, p.return().len);
  p.reconstruct();



  if (world.owner.id) {
    p.create()
      .string('OnConsoleMessage')
      .string(`\`5[\`\`\`w${world.name}\`\` \`$World Locked\`\` by ${world.owner.displayName} (${player.permissions >= Constants.Permissions.worldOwner ? '`2ACCESS GRANTED``' : '`4ACCESS DENIED``'})\`5]\`\``)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  }
};