const dialog = new (require('../Dialog'))();

module.exports = function(main, packet, peerid, p) {
  let player = main.players.get(peerid);
  let item = main.getItems().get(parseInt(packet.get('itemID')));

  if (item.itemID === 32 || item.itemID === 18) {
    p.create()
      .string('OnTextOverlay')
      .string('You\'d be sorry if you lost that!')
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
  } else {
    let itemToTrash = player.inventory.items.filter(i => i.itemID === item.itemID)[0];

    if (!itemToTrash) return;

    dialog.defaultColor()
      .addLabelWithIcon(`\`4Trash\`\` \`w${item.name}\`\``, item.itemID, 'big')
      .addTextBox(`How many to \`4destroy\`\`? (you have ${itemToTrash.itemCount})`)
      .addInputBox('count', '', '0', 4)
      .embed('itemID', item.itemID)
      .endDialog('trash_item', 'Cancel', 'OK')

    p.create()
      .string('OnDialogRequest')
      .string(dialog.str())
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
    dialog.reconstruct();
  };
};