const Dialog = require('../Dialog');

module.exports = {
  name: 'find',
  requiredPerms: 1,
  run: function(main, arguments, peerid, p) {
    let itemName = arguments.join(' ');

    if (!itemName || itemName.trim().length < 1) itemName = '';
    let dialog = new Dialog()
      .addLabelWithIcon('Find your item!', '1796', 'big')
      .addInputBox('itemName', '', itemName, 15)
      .endDialog('findItem', 'Cancel', 'OK');
    /*for (let [k, v] of items) {
      dialog.addButton(v.itemID, v.name, v.itemID)
    }*/

    p.create()
      .string('OnDialogRequest')
      .string(dialog.str())
      .end();

    main.Packet.sendPacket(peerid, p.return().data, p.return().len);
    p.reconstruct();
    dialog.reconstruct();
  }
};
