const Constants = require('../structs/Constants');
const InventoryItem = require('../structs/InventoryItem');

module.exports = function(main, packet, peerid, p, type, data) {
  let item = main.getItems().get(data.plantingTree);
  let player = main.players.get(peerid);

  if (Object.values(player.clothes).includes(data.plantingTree)) {
    let clothes = Object.entries(player.clothes);
    let equipped = clothes.filter(c => c[1] === data.plantingTree)[0];
    player.clothes[equipped[0]] = 0;

    if (item.itemID === 1904) // the one ring
      player.removeState('isInvis');

    if (item.clothingType === 6 && Object.values(player.clothes).filter(i => Constants.wings.includes(i)).length < 1)
      player.removeState('canDoubleJump');

    if (Constants.ItemEffects[item.name] && player.punchEffects.includes(item.name))
      player.removePunchEffect(item.name);

    main.players.set(peerid, player);
    main.Packet.sendClothes(peerid);
    return main.Packet.sendState(peerid);
  } else {
    let removedItem = main.getItems().get(player.clothes.back);
    let clothes = Object.values(player.clothes);

    if (item.clothingType === 6 && removedItem) {
      // replaced wings or back item
      let removeDoubleJump = 1;

      if (!Constants.wings.includes(item.itemID)) { // if they replace back with non double jump
        for (let i = 0; i < clothes.length; i++) {
          if (!removeDoubleJump) continue;

          if (Constants.wings.includes(clothes[i])) // they have equipped item that can double jump
            removeDoubleJump = 0;
        }

        if (removeDoubleJump)
          player.removeState('canDoubleJump');
      }
    }

    if (!player.punchEffects.includes(item.name)) {
      let itemData = [];

      for (let [k, v] of main.getItems()) {
        if (v.name === item.name)
          itemData.push(v);
        else continue;
      }

      if (itemData.length > 0) {
        let type = itemData[0].clothingType;

        for (let i = 0; i < player.punchEffects.length; i++) {
          if (itemData[0].actionType === 107) continue;

          itemData = [];

          for (let [k, v] of main.getItems()) {
            if (v.name === player.punchEffects[i])
              itemData.push(v);
            else continue;
          }

          for (let j = 0; j < itemData.length; j++) {
            if (itemData[j].clothingType === type) {
              if (itemData[j].name !== 'Fist')
                player.removePunchEffect(itemData[j].name);
            }
            player.addPunchEffect(item.name);
          }
        }
      }
    }
  }

  if (Constants.wings.includes(data.plantingTree))
    player.addState('canDoubleJump');

  if (item.actionType === Constants.Blocktypes.locks)// double click locks, e.g wl turns to dl
    return item.itemID === 242 ? changeWlToDl(main, peerid, player, item, p) : changeDlToWl(main, peerid, player, item, p);

  switch(item.clothingType) {
    case 0: {
      if (item.actionType !== Constants.Blocktypes.locks)
        player.clothes.hair = data.plantingTree;
      break;
    }

    case 1: {
      player.clothes.shirt = data.plantingTree;
      break;
    }

    case 2: {
      player.clothes.pants = data.plantingTree;
      break;
    }

    case 3: {
      player.clothes.feet = data.plantingTree;
      break;
    }

    case 4: {
      player.clothes.face = data.plantingTree;
      break;
    }

    case 5: {
      if (main.getItems().get(data.plantingTree).actionType === 107) // ances
        player.clothes.ances = data.plantingTree;
      else {
        if (data.plantingTree === 1904) // the one ring
          player.addState('isInvis');

        if (player.clothes.hand === 1904) // remove the one ring upon change of hand clothing
          player.removeState('isInvis');

        player.clothes.hand = data.plantingTree;
      }
      break;
    }

    case 6: {
      player.clothes.back = data.plantingTree;
       break;
    }

    case 7: {
      player.clothes.mask = data.plantingTree;
      break;
    }

    case 8: {
      player.clothes.necklace = data.plantingTree;
      break;
    }
  }

  main.players.set(peerid, player);
  main.Packet.sendClothes(peerid);
  main.Packet.sendState(peerid);
}

function changeWlToDl(main, peerid, player, item, p) {
  let itemInInventory = player.inventory.items.filter(i => i.itemID === item.itemID)[0];

  if (itemInInventory && itemInInventory.itemID === 242) {
    // has lock
    if (itemInInventory.itemCount >= 100) {
      // is 100 or greater than 100
      itemInInventory.itemCount -= 100; // remove 100 wl
      if (itemInInventory.itemCount === 0) { // no more world locks

      } else {
        for (let i = 0; i < player.inventory.items.length; i++) {
          if (player.inventory.items[i].itemID === itemInInventory.itemID) {
            player.inventory.items[i].itemCount = itemInInventory.itemCount;
          } else continue;
        }
      };

      let dlInInventory = player.inventory.items.filter(i => i.itemID === 1796)[0];
      if (dlInInventory) {
        dlInInventory.itemCount++;

        for (let i = 0; i < player.inventory.items.length; i++) {
          if (player.inventory.items[i].itemID === dlInInventory.itemID)
            player.inventory.items[i] = dlInInventory;
        }
      } else {
        // no dl yet
        let newItem = new InventoryItem();
        newItem.itemID = 1796;
        newItem.itemCount = 1;

        player.inventory.items.push(newItem); // add the dl
      }

      p.create()
        .string('OnTalkBubble')
        .intx(player.netID)
        .string('You compressed 100 `2World Locks`` into a `2Diamond Lock``!')
        .intx(0)
        .intx(1)
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      p.reconstruct();
    }

    main.Packet.sendClothes(peerid, true);
    main.Packet.sendInventory(peerid);
  }
}

function changeDlToWl(main, peerid, player, item, p) {
  if (item.itemID !== 1796) return;

  let dlInInventory = player.inventory.items.filter(i => i.itemID === 1796)[0];
  if (dlInInventory) {
    // we have dl
    let wlInInventory = player.inventory.items.filter(i => i.itemID === 242)[0]; // get wls

    if (wlInInventory) { // has wls
      if (wlInInventory.itemCount + 100 > 200) {// we cant give more than 200
        p.create()
          .string('OnTalkBubble')
          .intx(player.netID)
          .string('No more space to unshatter a `2Diamond Lock`` .')
          .intx(0)
          .intx(1)
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        return p.reconstruct();
      } else {
        p.create()
          .string('OnTalkBubble')
          .intx(player.netID)
          .string('You shattered a `2Diamond Lock`` into 100 `2World Locks``!')
          .intx(0)
          .intx(1)
          .end();

        main.Packet.sendPacket(peerid, p.return().data, p.return().len);
        p.reconstruct();
      }

      for (let i = 0; i < player.inventory.items.length; i++) {
        if (player.inventory.items[i].itemID === 242)
          player.inventory.items[i].itemCount += 100;
        else if (player.inventory.items[i].itemID === 1796)
          player.inventory.items[i].itemCount--;
      }
    } else {
      // no wl in inventory
      let newItem = new InventoryItem();
      newItem.itemID = 242;
      newItem.itemCount = 100;

      p.create()
        .string('OnTalkBubble')
        .intx(player.netID)
        .string('You shattered a `2Diamond Lock`` into 100 `2World Locks``!')
        .intx(0)
        .intx(1)
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      p.reconstruct();

      player.inventory.items.push(newItem);
    }

    main.players.set(peerid, player);
    main.Packet.sendInventory(peerid);
    main.Packet.sendClothes(peerid, true);
  }
}
