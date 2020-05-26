<a name="Packet"></a>

## Packet
Methods for sending/using/ packets.

**Kind**: global class

* [Packet](#Packet)
    * [.sendStringPacket(peerid, buffer)](#Packet+sendStringPacket) ⇒ <code>undefined</code>
    * [.log(peerid, message)](#Packet+log) ⇒ <code>undefined</code>
    * [.sendQuit(peerid)](#Packet+sendQuit) ⇒ <code>undefined</code>
    * [.sendPacket(peerid, packet, [length])](#Packet+sendPacket) ⇒ <code>undefined</code>
    * [.sendPacketRaw(peerid, a1, data, size, a4)](#Packet+sendPacketRaw) ⇒ <code>undefined</code>
    * [.GetStructPointerFromTankPacket(packet)](#Packet+GetStructPointerFromTankPacket) ⇒ <code>Number</code>
    * [.packPlayerMoving(data)](#Packet+packPlayerMoving) ⇒ <code>Buffer</code>
    * [.unpackPlayerMoving(data)](#Packet+unpackPlayerMoving) ⇒ <code>PlayerMoving</code>
    * [.sendPData(peerid, data)](#Packet+sendPData) ⇒ <code>undefined</code>
    * [.sendPlayerLeave(peerid)](#Packet+sendPlayerLeave) ⇒ <code>undefined</code>
    * [.sendWorld(peerid, world)](#Packet+sendWorld) ⇒ <code>undefined</code>
    * [.onSpawn(peer, msg)](#Packet+onSpawn) ⇒ <code>undefined</code>
    * [.onPeerConnect(peerid)](#Packet+onPeerConnect) ⇒ <code>undefined</code>
    * [.requestWorldSelect(peerid)](#Packet+requestWorldSelect) ⇒ <code>undefined</code>
    * [.sendState(peerid)](#Packet+sendState) ⇒ <code>undefined</code>

<a name="Packet+sendStringPacket"></a>

### packet.sendStringPacket(peerid, buffer) ⇒ <code>undefined</code>
Sends strings to peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| buffer | <code>String</code> | The string to send |

<a name="Packet+log"></a>

### packet.log(peerid, message) ⇒ <code>undefined</code>
Sends a "OnConsoleMessage" packet to the client

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| message | <code>String</code> | The message to send |

<a name="Packet+sendQuit"></a>

### packet.sendQuit(peerid) ⇒ <code>undefined</code>
Disconnects the peer.

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |

<a name="Packet+sendPacket"></a>

### packet.sendPacket(peerid, packet, [length]) ⇒ <code>undefined</code>
Sends a created packet to the peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| packet | <code>Buffer</code> | The packet to send |
| [length] | <code>Number</code> | OPTIONAL: The length to give, by default it will use the packet's length. |

<a name="Packet+sendPacketRaw"></a>

### packet.sendPacketRaw(peerid, a1, data, size, a4) ⇒ <code>undefined</code>
Sends a raw packet to the client

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| a1 | <code>Number</code> | <Not sure yet> |
| data | <code>Buffer</code> | Data to send |
| size | <code>Number</code> | Size of the data |
| a4 | <code>Number</code> | <Not sure yet> |

<a name="Packet+GetStructPointerFromTankPacket"></a>

### packet.GetStructPointerFromTankPacket(packet) ⇒ <code>Number</code>
Decodes the packet to get the packetType/Struct of the packet for packet type 4.

**Kind**: instance method of [<code>Packet</code>](#Packet)
**Returns**: <code>Number</code> - The packet type of the decoded packet.

| Param | Type |
| --- | --- |
| packet | <code>ArrayBuffer</code> |

<a name="Packet+packPlayerMoving"></a>

### packet.packPlayerMoving(data) ⇒ <code>Buffer</code>
Creates a packet that would contain data from the PlayerMoving class.

**Kind**: instance method of [<code>Packet</code>](#Packet)
**Returns**: <code>Buffer</code> - PlayerMoving packet

| Param | Type | Description |
| --- | --- | --- |
| data | <code>PlayerMoving</code> | PlayerMoving data |

<a name="Packet+unpackPlayerMoving"></a>

### packet.unpackPlayerMoving(data) ⇒ <code>PlayerMoving</code>
Decodes the packet from packt type 4 and converts it to a PlayerMoving data

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>ArrayBuffer</code> | The packet to get data from |

<a name="Packet+sendPData"></a>

### packet.sendPData(peerid, data) ⇒ <code>undefined</code>
Sends the player moving data to everyone in the same world as the peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
| data | <code>PlayerMoving</code> | PlayerMoving data |

<a name="Packet+sendPlayerLeave"></a>

### packet.sendPlayerLeave(peerid) ⇒ <code>undefined</code>
Makes a peer leaves a world

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |

<a name="Packet+sendWorld"></a>

### packet.sendWorld(peerid, world) ⇒ <code>undefined</code>
Sends a world to load

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer joining |
| world | <code>Object</code> | The world to send |

<a name="Packet+onSpawn"></a>

### packet.onSpawn(peer, msg) ⇒ <code>undefined</code>
Sends an onSpawn to a specific peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>String</code> | The peer to send data to. |
| msg | <code>String</code> | The packet to send |

<a name="Packet+onPeerConnect"></a>

### packet.onPeerConnect(peerid) ⇒ <code>undefined</code>
Sends an onSpawn to every other peer in the same world as the given peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | Peer that joined |

<a name="Packet+requestWorldSelect"></a>

### packet.requestWorldSelect(peerid) ⇒ <code>undefined</code>
Requests the World Select menu for the peer

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The peer to request for. |

<a name="Packet+sendState"></a>

### packet.sendState(peerid) ⇒ <code>undefined</code>
Sends the state of the peer by fetching it from players cache.

**Kind**: instance method of [<code>Packet</code>](#Packet)

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
