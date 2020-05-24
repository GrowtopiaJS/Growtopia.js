const Constants = require('../structs/Constants');
const PlayerMoving = require('../structs/PlayerMoving');

module.exports = function(main, packet, peerid, p, type, data) {
  let x = data.punchX;
  let y = data.punchY;

  let player = main.players.get(peerid);
  let world = main.worlds.get(player.currentWorld);
  let newData = new PlayerMoving();
  newData.x = x;
  newData.y = y;
  newData.punchX = x;
  newData.punchY = y;
  newData.xSpeed = 0;
  newData.ySpeed = 0;
  newData.netID = player.netID;
  newData.plantingTree = data.plantingTree;

  data.netID = player.netID;

  if (main.getItems().get(data.plantingTree).actionType === 20) return;
  if (main.getItems().get(data.plantingTree).actionType === 1) return;

  let worldBlock = world.items[x + (y * world.width)];

  if (data.plantingTree === 18) {
    // BREAK BLOCKS
    let block;

    if (world.owner.id && world.owner.id !== player.id && !world.isPublic && player.permissions < Constants.Permissions.worldOwner) {
      main.Packet.sendNothing(peerid, x, y, 0, -1);
      return main.Packet.broadcast(function(peer) {
        main.Packet.sendSound(peerid, 'audio/punch_locked.wav', 0);
      }, {
        sameWorldCheck: true,
        peer: peerid
      });
    }

    if (worldBlock.background > 0)
      block = worldBlock.background;

    if (worldBlock.foreground > 0)
      block = worldBlock.foreground;

    let type = main.getItems().get(block);
    if (!type) return;

    type = type.actionType;

    if (block === 6) return main.Packet.sendNothing(peerid, x, y);

    if (block === 8 && !(player.permissions & Constants.Permissions.admin)) {
      p.create()
        .string('OnTalkBubble')
        .intx(player.netID)
        .string('It\'s too strong to break')
        .intx(0)
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      return p.reconstruct();
    }
    let punchedBlock = main.getItems().get(worldBlock.foreground > 0 ? worldBlock.foreground : worldBlock.background);

    if (punchedBlock) {
      if (worldBlock.breakLevel < (punchedBlock.breakHits / 6) - 1) {
        // not destroyed yet
        worldBlock.breakLevel++;

        newData.packetType = 0x8;
        newData.plantingTree = worldBlock.breakLevel + 1;

        setTimeout(() => {
          if (worldBlock.breakLevel !== worldBlock.breakLevel + 1) {
            // clear it
            worldBlock.breakLevel = 0;
          }
        }, punchedBlock.dropChance * 1000); // dropChance might be the correct value but incorrect name

        world.items[x + (y * world.width)] = worldBlock;
        main.worlds.set(world.name, world);

        main.Packet.broadcast(function(peer) {
          main.Packet.sendNothing(peer, x, y, newData.plantingTree, player.netID);
        }, {
          sameWorldCheck: true,
          world: player.currentWorld,
          peer: peerid
        });

        return;
      } else if (worldBlock.breakLevel >= (punchedBlock.breakHits / 6) - 1) {
        if (worldBlock.foreground > 0) {
          // locks
          if (main.getItems().get(worldBlock.foreground).actionType === Constants.Blocktypes.locks) {
            main.Packet.setNickname(peerid, player.displayName);
            world.owner = {};
            world.isPublic = true;

            player.worldsOwned = player.worldsOwned.filter(i => i !== world.name);
            player.removeRole('worldOwner');

            p.create()
              .string('OnConsoleMessage')
              .string('World lock has been removed!')
              .end();

            main.Packet.broadcast(function(peer) {
              main.Packet.sendPacket(peer, p.return().data, p.return().len);
            }, {
              sameWorldCheck: true,
              peer: peerid
            });

            p.reconstruct();
          }

          worldBlock.foreground = 0;
        } else if (worldBlock.background > 0)
          worldBlock.background = 0;

        worldBlock.breakLevel = 0;
        world.items[x + (y * world.width)] = worldBlock;
        main.worlds.set(world.name, world);
      }
    }

    main.worlds.set(player.currentWorld, world);
    main.players.set(peerid, player);
  } else if (data.plantingTree !== 18 || data.plantingTree !== 32) {
    if (worldBlock.foreground > 0 || worldBlock.foreground > 0)
      return main.Packet.sendNothing(peerid, x, y);

    // PLACE BLOCKS
    let items = player.inventory.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].itemID === data.plantingTree) {
        if (items[i].itemCount > 1) {
          items[i].itemCount--;
        } else {
          items.splice(i, 1);
        }
      }
    }

    player.inventory.items = items;
    let blockType = main.getItems().get(data.plantingTree).actionType;

    if (blockType === Constants.Blocktypes.background) {
      worldBlock.background = data.plantingTree;
    } else {
      if (world.owner.id && world.owner.id !== player.id && !world.isPublic && player.permissions < Constants.Permissions.worldOwner) {
        main.Packet.sendNothing(peerid, x, y, 0, -1);
        return main.Packet.broadcast(function(peer) {
          main.Packet.sendSound(peerid, 'audio/punch_locked.wav', 0);
        }, {
          sameWorldCheck: true,
          peer: peerid
        });
      }

      if ((blockType === 15 && !(Constants.Permissions.admin & player.permissions)) || (data.plantingTree === 202 || data.plantingTree === 204 || data.plantingTree === 206 || data.plantingTree === 4994)) {
        p.create()
          .string('OnTalkBubble')
          .intx(player.netID)
          .string('You can\'t do that')
          .intx(0)
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      }

      if (blockType === Constants.Blocktypes.locks) {
        // place locks
        if (world.items.filter(i => main.getItems().get(i.foreground).actionType === Constants.Blocktypes.locks).length > 0) {
          p.create()
            .string('OnTalkBubble')
            .intx(player.netID)
            .string('You can\'t place any more locks.')
            .intx(0)
            .end();

          main.Packet.sendPacket(peerid, p.return().data, p.return().len);
          return p.reconstruct();
        }

        p.create()
          .string('OnTalkBubble')
          .intx(player.netID)
          .string(`\`5[\`\`\`w${world.name}\`\` has been \`$World Locked\`\` by ${player.displayName}\`5]\``)
          .intx(0)
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        p.reconstruct();

        p.create()
          .string('OnConsoleMessage')
          .string(`\`5[\`\`\`w${world.name}\`\` has been \`$World Locked\`\` by ${player.displayName}\`5]\``)
          .end();

        main.Packet.broadcast(function(peer) {
          main.Packet.sendPacket(peer, p.return().data, p.return().len);
          main.Packet.sendSound(peer, 'audio/use_lock.wav', 0);
        }, {
          sameWorldCheck: true,
          peer: peerid
        });

        p.reconstruct();

        main.Packet.setNickname(peerid, `\`2${player.displayName}`);
        player.worldsOwned.push(world.name);
        world.owner = player;
        world.isPublic = false;
        player.addRole('worldOwner');
      }

      worldBlock.foreground = data.plantingTree;
    }
  }

  world.items[x + (y * world.width)] = worldBlock;
  main.worlds.set(player.currentWorld, world);
  main.players.set(peerid, player);

  main.Packet.broadcast(function(peer) {
    main.Packet.sendPacketRaw(peer, 4, main.Packet.packPlayerMoving(data), 56, 0);
  }, {
    sameWorldCheck: true,
    world: player.currentWorld,
    peer: peerid
  });
}