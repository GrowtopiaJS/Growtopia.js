const PlayerInventory = require('../structs/PlayerInventory');
const InventoryItem = require('../structs/InventoryItem');

module.exports = function(main, packet, peerid, p) {
  main.Packet.requestWorldSelect(peerid);

  let player = main.players.get(peerid);
  let peers = [...main.players.keys()];
  let staff = 0;
  let string = `\`oThere ${peers.length > 1 ? 'are' : 'is'} \`w${peers.length}\`o player${peers.length > 1 ? 's' : ''} online. \`w${staff}\`o of them are a staff member.`;

  p.create()
    .string('OnConsoleMessage')
    .string(string)
    .end();

  main.Packet.sendPacket(peerid, p.return().data, p.return().len);
  p.reconstruct();

  let welcomedialog = main.Dialog
    .defaultColor()
    .addLabelWithIcon("Welcome to Growtopia.js!``","5016","big")
    .addSpacer("small")
    .addTextBox("Our Discord: https://discord.gg/3NrVX8s!")
    .addSpacer("small")
    .addTextBox("Built by Alexander9673 and lukeawarmcat!")
    .endDialog("gazette", "", "OK");

  p.create()
    .string("OnDialogRequest")
    .string(welcomedialog.str())
    .end();


  main.Packet.sendPacket(peerid, p.return().data, p.return().len);

  p.reconstruct();
  welcomedialog.reconstruct();

  let inv = new PlayerInventory();
  let invLength = player.inventory.items.length || 2;

  for (let i = 0; i < invLength; i++) {
    let item = new InventoryItem();
    let invItem = player.inventory.items[i] ? player.inventory.items[i].itemID : (i * 2) + 2;
    let itemCount = player.inventory.items[i] ? player.inventory.items[i].itemCount : 200;

    if (invLength === 2) {
      if (i === 0)
        invItem = 18;
      else if (i === 1)
        invItem = 16 * 2;
    }

    if (!player.inventory.items[i] && i > player.inventory.autoAddAmount) continue;

    item.itemID = invItem;
    item.itemCount = itemCount;
    
    inv.items.push(item);
  }

  player.inventory = inv;

  main.players.set(peerid, player);
};