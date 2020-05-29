const { EventEmitter } = require('events');
const Event = require('./Event');
let listening = true;

/**
 * @extends {EventEmitter} The class the contains all methods that has something to do with the hosts.
 */

class Host extends EventEmitter {
  #main;
  constructor(main) {
    super(main);
    this.#main = main;

    this.on('connect', (peerid) => Event.onConnect(main, peerid));
    this.on('receive', (packet, peerid) => Event.onReceive(main, packet, peerid));
    this.on('disconnect', (peerid) => Event.onDisconnect(main, peerid));
  }

  /**
   * Initializes enet.
   * @returns {Number}
   */

  init() {
    this.#main.init();

    return this.#main.getModule().Host.init();
  }

  /**
   * Creates the server for the growtopia server.
   * @returns {undefined}
   */

  create() {
    if (!this.#main.isInitialized)
      throw new Error("Initialize enet first.");

    return this.#main.getModule().Host.create({
      port: this.#main.port,
      channels: this.#main.channels,
      peers: this.#main.peers,
      ico: this.#main.bandwith.incoming,
      ogo: this.#main.bandwith.outgoing
    });
  }

  /**
   * Starts the growtopia server
   * @returns {undefined}
   */

  start() {
    if (!this.#main.isInitialized)
      throw new Error("Initialize enet first.");

    console.log(`Server now listening on port: ${this.#main.port}`);

    const conn = () => {
      return new Promise(resolve => {
        setImmediate(() => {
          this.#main.getModule().Host.start(this.emit.bind(this));
          resolve();
        })
      })
    }

    const run = async () => {
      while(listening)
        await conn();
    }

    run();
    this.checkExit();

    return;
  }

  /**
   * Checks if a peer is still connected
   * @param {String} peer The peer to check if it is connected/disconnected
   * @return {Boolean} Whether or not it is connected or not
   */

  checkIfConnected(peer) {
    return this.#main.getModule().Host.checkIfConnected(peer);
  }

  /**
   * Checks if two peers are in the same world
   * @param {String} peerid The peer to compare
   * @param {String} peerid2 The peer to compare with
   * @returns {Boolean} If they are in the same world.
   */

  isInSameWorld(peerid, peerid2) {
    let player = this.#main.players.get(peerid);
    let player2 = this.#main.players.get(peerid2);

    return (player.currentWorld === player2.currentWorld) && (player.currentWorld !== "EXIT" && player2.currentWorld !== "EXIT");
  }

  /**
   * Checks if the server was stopped with CTRL + C to save the player and world data.
   * @returns {undefined}
   */

  checkExit() {
    process.on('SIGINT', () => {
      listening = false;
      this.#main.webServer.kill();
      console.log('Saving Players to Database...');
      for (let [peerid, player] of this.#main.players) {
        player.temp.peerid = "";
        player.temp.MovementCount = 0;
        player.currentWorld = 'EXIT';

        if (!player.tankIDName)
          continue;

        this.#main.playersDB.set(player.tankIDName.toLowerCase(), player);
        this.#main.players.delete(peerid);
      }

      console.log('Saving worlds to Database...');
      for (let [name, world] of this.#main.worlds) {
        world.players = [];
        world.breakLevel = 0;
        world.interval = -1;

        this.#main.worldsDB.set(name, world);
        this.#main.worlds.delete(name);
      }

      process.exit();
    });
  }

  /**
   * Fetches the id of the peer
   * @param {String} peerid The id of the peer
   * @returns {String} The ip of the peer
   */

  getIP(peerid) {
    return this.#main.getModule().Host.getIP(peerid);
  }
};

module.exports = Host;
