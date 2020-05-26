<a name="PacketCreator"></a>

## PacketCreator
PacketCreator makes the syntax for making packets so much easier.

**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | The packet data that was created |
| len | <code>Number</code> | Length of the packet |
| indexes | <code>Number</code> |  |


* [PacketCreator](#PacketCreator)
    * [.create(string, length)](#PacketCreator+create) ⇒ [<code>PacketCreator</code>](#PacketCreator)
    * [.string(string)](#PacketCreator+string) ⇒ [<code>PacketCreator</code>](#PacketCreator)
    * [.int(val)](#PacketCreator+int) ⇒ [<code>PacketCreator</code>](#PacketCreator)
    * [.intx(val)](#PacketCreator+intx) ⇒ [<code>PacketCreator</code>](#PacketCreator)
    * [.end()](#PacketCreator+end) ⇒ [<code>PacketCreator</code>](#PacketCreator)
    * [.reconstruct()](#PacketCreator+reconstruct) ⇒ [<code>PacketCreator</code>](#PacketCreator)
    * [.return()](#PacketCreator+return) ⇒ [<code>PacketCreator</code>](#PacketCreator)
    * [.new()](#PacketCreator+new) ⇒ [<code>PacketCreator</code>](#PacketCreator)

<a name="PacketCreator+create"></a>

### packetCreator.create(string, length) ⇒ [<code>PacketCreator</code>](#PacketCreator)
Creates a packet with specific packet headers and the given length.

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)

| Param | Type | Description |
| --- | --- | --- |
| string | <code>String</code> | The Packet Header to use. |
| length | <code>Number</code> | The length of the packet to create |

<a name="PacketCreator+string"></a>

### packetCreator.string(string) ⇒ [<code>PacketCreator</code>](#PacketCreator)
Adds a string to the packet, along with the index and string length

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)

| Param | Type | Description |
| --- | --- | --- |
| string | <code>String</code> | The string to add to the packet |

<a name="PacketCreator+int"></a>

### packetCreator.int(val) ⇒ [<code>PacketCreator</code>](#PacketCreator)
Adds a int to the packet, along with the index

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | The number to add to the packet |

<a name="PacketCreator+intx"></a>

### packetCreator.intx(val) ⇒ [<code>PacketCreator</code>](#PacketCreator)
Same as `PacketCreator#int` but instead, this places the packet length at offset 5 instead of 9.

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | The number to add to the packet |

<a name="PacketCreator+end"></a>

### packetCreator.end() ⇒ [<code>PacketCreator</code>](#PacketCreator)
Ends the packet by adding the indexes to specifc offsets and adding `00` to the end of the packet.

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)
<a name="PacketCreator+reconstruct"></a>

### packetCreator.reconstruct() ⇒ [<code>PacketCreator</code>](#PacketCreator)
Reconstructs the packet. Does not create a new instance, it just resets all data of the packet.

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)
<a name="PacketCreator+return"></a>

### packetCreator.return() ⇒ [<code>PacketCreator</code>](#PacketCreator)
Returns the PacketCreator along with it's accessible data.

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)
<a name="PacketCreator+new"></a>

### packetCreator.new() ⇒ [<code>PacketCreator</code>](#PacketCreator)
Creates a new instance of PacketCreator

**Kind**: instance method of [<code>PacketCreator</code>](#PacketCreator)
