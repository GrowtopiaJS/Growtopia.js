module.exports = function(main, packet, peerid, p) {
  let dialog = main.Dialog.defaultColor()
    .addLabelWithIcon('`wGet a GrowID``', '206', 'big')
    .addSpacer('small')
    .addTextBox('A `wGrowID means `oyou can use a name and password to logon from any device.')
    .addSpacer('small')
    .addTextBox('This `wname`o will be reserved for you and `wshwon to other players`o, so choose wisely.')
    .addInputBox('username', 'GrowID', '', 30)
    .addInputBox('password', 'Password', '', 100)
    .addSpacer('small')
    .addTextBox('Your email will be used for security verification and possible loss of access on your account.')
    .addInputBox('email', 'Email', '', 100)
    .endDialog('register', 'Cancel', 'Get My GrowID!')

  p.create()
    .string('OnDialogRequest')
    .string(dialog.str())
    .end();

  main.Packet.sendPacket(peerid, p.return().data, p.return().len);
  p.reconstruct();
  dialog.reconstruct();
};
