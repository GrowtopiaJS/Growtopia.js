const Constants = require('../structs/Constants');

module.exports = function(main, packet, peerid, p, type, data) {
  let item = main.getItems().get(data.plantingTree);
  let player = main.players.get(peerid);

  if (Object.values(player.clothes).includes(data.plantingTree)) {
    let clothes = Object.entries(player.clothes);
    let equipped = clothes.filter(c => c[1] === data.plantingTree)[0];
    player.clothes[equipped[0]] = 0;

    if (Constants.wings.includes(data.plantingTree))
      player.removeState('canDoubleJump');

    if (Constants.ItemEffects[item.name] && player.punchEffects.includes(item.name))
      player.removePunchEffect(item.name);

      main.players.set(peerid, player);
      main.Packet.sendClothes(peerid);
      return main.Packet.sendState(peerid);
  } else {
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
    player.addState('canDoubleJump')

  switch(item.clothingType) {
    case 0: {
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
      player.clothes.hand = data.plantingTree;
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