const Dialog = require('../Dialog');

module.exports = {
  name: 'find',
  run: function(main, arguments, peerid, p) {
    let name = arguments.join(' ');
    let items = main.getItems();

    let dialog = new Dialog()
      .addLabelWithIcon('Find your item!', '1948', 'small')
      .addInputBox('itemName', '', '', 30)
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