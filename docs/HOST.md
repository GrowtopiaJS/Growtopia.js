<a name="Host"></a>

## Host ⇐ <code>EventEmitter</code>
**Kind**: global class
**Extends**: <code>EventEmitter</code>

* [Host](#Host) ⇐ <code>EventEmitter</code>
    * [.init()](#Host+init) ⇒ <code>Number</code>
    * [.create()](#Host+create) ⇒ <code>undefined</code>
    * [.start()](#Host+start) ⇒ <code>undefined</code>
    * [.checkIfConnected(peer)](#Host+checkIfConnected) ⇒ <code>Boolean</code>
    * [.isInSameWorld(peerid, peerid2)](#Host+isInSameWorld) ⇒ <code>Boolean</code>
    * [.checkExit()](#Host+checkExit) ⇒ <code>undefined</code>
    * [.getIP(peerid)](#Host+getIP) ⇒ <code>String</code>

<a name="Host+init"></a>

### host.init() ⇒ <code>Number</code>
Initializes enet.

**Kind**: instance method of [<code>Host</code>](#Host)
<a name="Host+create"></a>

### host.create() ⇒ <code>undefined</code>
Creates the server for the growtopia server.

**Kind**: instance method of [<code>Host</code>](#Host)
<a name="Host+start"></a>

### host.start() ⇒ <code>undefined</code>
Starts the growtopia server

**Kind**: instance method of [<code>Host</code>](#Host)
<a name="Host+checkIfConnected"></a>

### host.checkIfConnected(peer) ⇒ <code>Boolean</code>
Checks if a peer is still connected

**Kind**: instance method of [<code>Host</code>](#Host)
**Returns**: <code>Boolean</code> - Whether or not it is connected or not

| Param | Type | Description |
| --- | --- | --- |
| peer | <code>String</code> | The peer to check if it is connected/disconnected |

<a name="Host+isInSameWorld"></a>

### host.isInSameWorld(peerid, peerid2) ⇒ <code>Boolean</code>
Checks if two peers are in the same world

**Kind**: instance method of [<code>Host</code>](#Host)
**Returns**: <code>Boolean</code> - If they are in the same world.

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The peer to compare |
| peerid2 | <code>String</code> | The peer to compare with |

<a name="Host+checkExit"></a>

### host.checkExit() ⇒ <code>undefined</code>
Checks if the server was stopped with CTRL + C to save the player and world data.

**Kind**: instance method of [<code>Host</code>](#Host)
<a name="Host+getIP"></a>

### host.getIP(peerid) ⇒ <code>String</code>
Fetches the id of the peer

**Kind**: instance method of [<code>Host</code>](#Host)
**Returns**: <code>String</code> - The ip of the peer

| Param | Type | Description |
| --- | --- | --- |
| peerid | <code>String</code> | The id of the peer |
