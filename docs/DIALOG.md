<a name="Dialog"></a>

## Dialog
Dialog creator class

**Kind**: global class

* [Dialog](#Dialog)
    * [.defaultColor(color)](#Dialog+defaultColor) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addSpacer(type)](#Dialog+addSpacer) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addLabelWithIcon(text, titleid, type)](#Dialog+addLabelWithIcon) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addButton(name, text)](#Dialog+addButton) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addCheckbox(name, string, type)](#Dialog+addCheckbox) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addTextBox(str)](#Dialog+addTextBox) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addSmallText(str)](#Dialog+addSmallText) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addInputBox(name, text, cont, size)](#Dialog+addInputBox) ⇒ [<code>Dialog</code>](#Dialog)
    * [.addQuickExit()](#Dialog+addQuickExit) ⇒ [<code>Dialog</code>](#Dialog)
    * [.endDialog(name, nvm, accept)](#Dialog+endDialog) ⇒ [<code>Dialog</code>](#Dialog)
    * [.raw(str)](#Dialog+raw) ⇒ [<code>Dialog</code>](#Dialog)
    * [.str()](#Dialog+str) ⇒ [<code>Dialog</code>](#Dialog)
    * [.reconstruct()](#Dialog+reconstruct) ⇒ [<code>Dialog</code>](#Dialog)

<a name="Dialog+defaultColor"></a>

### dialog.defaultColor(color) ⇒ [<code>Dialog</code>](#Dialog)
Sets the default color of the dialog

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type |
| --- | --- |
| color | <code>String</code> |

<a name="Dialog+addSpacer"></a>

### dialog.addSpacer(type) ⇒ [<code>Dialog</code>](#Dialog)
Adds a spacer for the dialog

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | Spacer type, 'big' or 'small' |

<a name="Dialog+addLabelWithIcon"></a>

### dialog.addLabelWithIcon(text, titleid, type) ⇒ [<code>Dialog</code>](#Dialog)
Adds a label with an icon

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Title of the label |
| titleid | <code>String</code> | The icon to add to the label |
| type | <code>String</code> \| <code>Number</code> | The type of the label, 'big' or 'small' |

<a name="Dialog+addButton"></a>

### dialog.addButton(name, text) ⇒ [<code>Dialog</code>](#Dialog)
Adds a button

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the button |
| text | <code>String</code> | The text in the button |

<a name="Dialog+addCheckbox"></a>

### dialog.addCheckbox(name, string, type) ⇒ [<code>Dialog</code>](#Dialog)
Adds a checkbox

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the checkbox |
| string | <code>String</code> | The text in the checkbox |
| type | <code>String</code> | The type of the checkbox 'select' or 'not_selected' |

<a name="Dialog+addTextBox"></a>

### dialog.addTextBox(str) ⇒ [<code>Dialog</code>](#Dialog)
Adds a text box

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | The str to add |

<a name="Dialog+addSmallText"></a>

### dialog.addSmallText(str) ⇒ [<code>Dialog</code>](#Dialog)
Adds a small text

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | The text to add |

<a name="Dialog+addInputBox"></a>

### dialog.addInputBox(name, text, cont, size) ⇒ [<code>Dialog</code>](#Dialog)
Adds an input box

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | The id of the input box |
| text | <code>String</code> |  | The text beside it |
| cont | <code>String</code> |  | Default content? |
| size | <code>String</code> \| <code>Number</code> | <code>0</code> | The max size of the box |

<a name="Dialog+addQuickExit"></a>

### dialog.addQuickExit() ⇒ [<code>Dialog</code>](#Dialog)
Adds quick exit button

**Kind**: instance method of [<code>Dialog</code>](#Dialog)
<a name="Dialog+endDialog"></a>

### dialog.endDialog(name, nvm, accept) ⇒ [<code>Dialog</code>](#Dialog)
Adds buttons at the end of the dialog

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The id of the dialog |
| nvm | <code>String</code> | The value of the button when you want it closed/cancelled. |
| accept | <code>String</code> | The value of the button when you want it to add a value to the 'dialog_return' packet |

<a name="Dialog+raw"></a>

### dialog.raw(str) ⇒ [<code>Dialog</code>](#Dialog)
Adds a raw dialog, useful if the function for that specific dialog would not be here

**Kind**: instance method of [<code>Dialog</code>](#Dialog)

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | The dialog to add |

<a name="Dialog+str"></a>

### dialog.str() ⇒ [<code>Dialog</code>](#Dialog)
Returns the created string

**Kind**: instance method of [<code>Dialog</code>](#Dialog)
<a name="Dialog+reconstruct"></a>

### dialog.reconstruct() ⇒ [<code>Dialog</code>](#Dialog)
Removes the value of the str to return

**Kind**: instance method of [<code>Dialog</code>](#Dialog)
