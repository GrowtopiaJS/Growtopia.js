/**
 * @class Dialog creator class
 */

class Dialog {
  #str = "";
  constructor() {}

  /**
   * Sets the default color of the dialog
   * @param {String} color
   * @returns {Dialog}
   */

  defaultColor(color) {
    this.#str += `set_default_color|${color || '`o'}\n`;
    return this;
  }

  /**
   * Adds a spacer for the dialog
   * @param {String} type Spacer type, 'big' or 'small'
   * @returns {Dialog}
   */

  addSpacer(type) {
    switch (type.toUpperCase()) {
      case 'BIG':
        this.#str += 'add_spacer|big|\n';
        break;

      case 'SMALL':
        this.#str += 'add_spacer|small|\n';
        break;
    }

    return this;
  }

  /**
   * Adds a label with an icon
   * @param {String} text Title of the label
   * @param {String} titleid The icon to add to the label
   * @param {String|Number} type The type of the label, 'big' or 'small'
   * @returns {Dialog}
   */

  addLabelWithIcon(text, titleid, type) {
    switch (type.toUpperCase()) {
      case 'BIG':
        this.#str += `add_label_with_icon|big|${text}|left|${titleid}|\n`;
        break;

      case 'SMALL':
        this.#str += `add_label_with_icon|small|${text}|left|${titleid}|\n`;
        break;
    }

    return this;
  }

  /**
   * Embeds value to the dialog.
   * @param {String} key The key of the value to embed
   * @param {String} val The value of that key.
   * @returns {Dialog}
   */

  embed(key, val) {
    this.#str += `embed_data|${key}|${val}\n`;
    return this;
  }

  /**
   * Adds a button
   * @param {String} name The name of the button
   * @param {String} text The text in the button
   * @returns {Dialog}
   */

  addButton(name, text) {
    this.#str += `add_button|${name}|${text}|noflags|0|0|\n`;
    return this;
  }

  /**
   * Adds a checkbox
   * @param {String} name The name of the checkbox
   * @param {String} string The text in the checkbox
   * @param {String} type The type of the checkbox 'select' or 'not_selected'
   * @returns {Dialog}
   */

  addCheckbox(name, string, type) {
    switch (type.toUpperCase()) {
      case 'SELECTED':
        this.#str += `add_checkbox|${name}|${string}|1|\n`;
        break;

      case 'NOT_SELECTED':
        this.#str += `add_checkbox|${name}|${string}|0|\n`;
        break;
    }

    return this;
  }

  /**
   * Adds a text box
   * @param {String} str The str to add
   * @returns {Dialog}
   */

  addTextBox(str) {
    this.#str += `add_textbox|${str}|left|\n`;
    return this;
  }

  /**
   * Adds a small text
   * @param {String} str The text to add
   * @returns {Dialog}
   */

  addSmallText(str) {
    this.#str += `add_smalltext|${str}|\n`;
    return this;
  }

  /**
   * Adds an input box
   * @param {String} name The id of the input box
   * @param {String} text The text beside it
   * @param {String} cont Default content?
   * @param {String|Number} size The max size of the box
   * @returns {Dialog}
   */

  addInputBox(name = "", text = "", cont = "", size = 0) {
    this.#str += `add_text_input|${name}|${text}|${cont}|${size}|\n`;
    return this;
  }

  /**
   * Adds quick exit button
   * @returns {Dialog}
   */

  addQuickExit() {
    this.#str += 'add_quick_exit|\n';
    return this;
  }

  /**
   * Adds buttons at the end of the dialog
   * @param {String} name The id of the dialog
   * @param {String} nvm The value of the button when you want it closed/cancelled.
   * @param {String} accept The value of the button when you want it to add a value to the 'dialog_return' packet
   * @returns {Dialog}
   */

  endDialog(name, nvm, accept) {
    this.#str += `end_dialog|${name || ""}|${nvm || ""}|${accept || ""}|\n`;
    return this;
  }

  /**
   * Adds a raw dialog, useful if the function for that specific dialog would not be here
   * @param {String} str The dialog to add
   * @return {Dialog}
   */

  raw(str) {
    this.#str += `${str}`;
    return this;
  }

  /**
   * Returns the created string
   * @returns {Dialog}
   */

  str() {
    return this.#str;
  }

  /**
   * Removes the value of the str to return
   * @return {Dialog}
   */

  reconstruct() {
    this.#str = "";
    return this;
  }
};

module.exports = Dialog;
