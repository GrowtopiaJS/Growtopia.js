const InventoryItem = require('../structs/InventoryItem');

module.exports = {
  name: 'item',
  requiredPerms: 1,
  run: function(main, arguments, peerid, p) {
    let player = main.players.get(peerid);
    let inv = main.players.get(peerid).inventory;
    let item = arguments[0];
    let amount = arguments[1] || 1;
    let obj = new InventoryItem();

    if (player.inventory.items.length === player.inventory.size) {
      p.create()
        .string('OnConsoleMessage')
        .string('You can\'t add any more items.')
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      return p.reconstruct();
    }

    obj.itemID = parseInt(item);
    obj.itemCount = parseInt(amount);

    if (obj.itemCount > 200) obj.itemCount = 200;

    if (!main.getItems().has(obj.itemID)) {
      p.create()
        .string('OnConsoleMessage')
        .string(`Can't find an item with id \`w${item}\`\``)
        .end();

      main.Packet.sendPacket(peerid, p.return().data, p.return().len);
      return p.reconstruct();
    }

    if (inv.items.filter(i => i.itemID === obj.itemID).length < 1)
      inv.items.push(obj);
    else {
      let item = inv.items.filter(i => i.itemID === obj.itemID)[0];
      let count = obj.itemCount + item.itemCount;
      let index = inv.items.findIndex(i => i.itemID === obj.itemID);

      obj.itemCount = count > 200 ? 200 : count;
      inv.items[index].itemCount = obj.itemCount;
    }

    p.create()
      .string('OnConsoleMessage')
      .string(`Added \`w${main.getItems().get(obj.itemID).name}\`\` to your inventory.`)
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();

    player.inventory = inv;
    main.players.set(peerid, player);

    main.Packet.sendClothes(peerid, true);
    main.Packet.sendInventory(peerid);
  }
};
