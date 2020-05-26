const { EventEmitter } = require('events');
const { readFileSync, readdirSync, statSync } = require('fs');
const WorldItem = require('./structs/WorldItem');
const WorldInfo = require('./structs/WorldInfo');
const CONSTANTS = require('./structs/Constants');
const PacketCreator = require('./PacketCreator');
const { execSync, exec } = require('child_process');

let p = new PacketCreator();
let netID = 0;
let items = new Map();
let Enmap;
let lastUID = 0;

try {
  Enmap = require('enmap');
  require('better-sqlite3');
} catch (e) {
  throw new Error('enmap or better-sqlite-pool is not installed. Kindly install it with "npm install enmap" or "npm install better-sqlite-pool". To increase installation speed, kindly add "-j 8" to use 8 threads when building the sqlite module.');
};

/**
 * The Main Class is the file that you would require to handle everything.
 * @extends EventEmitter The class responsible for handling events.
 * @prop {Object} options Options for the server.
 * @prop {Number} options.port The port to use for the growtopia server.
 * @prop {Number} options.channels The amount of channels to use.
 * @prop {Number} options.peers The amount of peers to use.
 * @prop {Object} options.bandwith Options for the bandwith.
 * @prop {Number} options.bandwith.incoming The max amount of incoming bandwith.
 * @prop {Number} options.bandwith.outgoing The max amount of outgoing bandwith.
 * @prop {String} options.location The location of the items.dat file.
 * @prop {String} options.cdn The cdn content to use.
 * @prop {String} options.secretKey The secret key to use for passwords, PLEASE CHANGE THIS
 * @prop {Boolean} options.autoWeb This will run the webserver on a separate process so that you don't have to run "web.js"
 */

class Main extends EventEmitter {
  #gtps;
  #isInitialized;
  #version;
  #loadCommands = function() {
    let files = readdirSync(this.commandsDir)
      .filter(file => statSync(`${this.commandsDir}/${file}`).isFile() && file.endsWith('.js'));

    for (let i = 0; i < files.length; i++) {
      let file = require(`${this.commandsDir}/${files[i]}`);
      if (!file.requiredPerms && isNaN(file.requiredPerms))
        file.requiredPerms = 0;

      this.commands.set(file.name, file);

      console.log(`Loaded ${file.name} command`);
    }
  }

  #loadTanks = function() {
    let files = readdirSync(`${__dirname}/tanks`)
      .filter(file => statSync(`${__dirname}/tanks/${file}`).isFile() && file.endsWith('.js'));

    for (let i = 0; i < files.length; i++) {
      let file = require(`${__dirname}/tanks/${files[i]}`);
      this.tanks.set(files[i].split('.js')[0], file);

      console.log(`Loaded ${files[i].split('.js')[0]} tank packet.`);
    }
  }

  #loadWorldsToCache = function() {
    for (let [name, world] of this.worldsDB) {
      world.breakLevel = 0;
      this.worlds.set(name, world);
    }
  }

  #startWebserver = function() {
    this.webServer = exec('node web.js', function(error, out, input) {
      if (error)
        throw new Error(error);
    });
  }

  constructor(options = {}) {
    super(options);
    this.#gtps;

    try {
      this.#gtps = require('../lib/build/Release/gtps.node');
    } catch(e) {
      console.log('gtps.node can\'t be found. Will build the C++ Module.\nBuilding...');

      execSync(`node-gyp rebuild -j 8 --directory=lib`);
      process.exit(0);
    };

    this.#version = this.#gtps.version;

    Object.defineProperties(this, {
      port: {
        value: options.port || 17091
      },

      channels: {
        value: options.channels || 32
      },

      peers: {
        value: options.peers || 2
      },

      bandwith: {
        value: options.bandwith || {
          incoming: 0,
          outgoing: 0
        }
      },

      itemsDatHash: {
        value: this.getHash(options.location || 'items.dat')
      },

      itemsDat: {
        value: this.buildItemsDatabase(options.location || 'items.dat')
      },

      cdn: {
        value: options.cdn || "0098/CDNContent61/cache/"
      },

      commandsDir: {
        value: options.commandsDir || `${__dirname}/commands`
      },

      secret: {
        value: options.secretKey || 'growtopia.js'
      },

      autoWeb: {
        value: options.autoWeb || false
      },

      /**
       * @prop {Map} worlds The worlds cache
       */

      worlds: {
        value: new Map()
      },

      /**
       * @prop {Map} players The players cache
       */

      players: {
        value: new Map()
      },

      /**
       * @prop {Map} commands The commands cache
       */

      commands: {
        value: new Map()
      },

      /**
       * @prop {Enmap} playersDB The players database
       */

      playersDB: {
        value: new Enmap({
          name: 'players'
        })
      },

      /**
       * @prop {Enmap} worldsDB The worlds database
       */

      worldsDB: {
        value: new Enmap({
          name: 'worlds'
        })
      },

      /**
       * @prop {Packet} Packet The packet handler for the server
       */

      Packet: {
        value: new(require('./Packet'))(this)
      },

      /**
       * @prop {Host} Host The host handler for the server
       */

      Host: {
        value: new(require('./Host'))(this)
      },

      /**
       * @prop {String} actions The location of the actions.
       */

      actions: {
        value: readdirSync(`${__dirname}/actions`)
      },

      /**
       * @prop {Dialog} Dialog The dialog creator for the server
       */

      Dialog: {
        value: new(require('./Dialog'))()
      },

      /**
       * @prop {String} disconnects A map of all players that disconnected, this can be useful for disconnected people. Should be deleted after transfer!
       */

      disconnects: {
        value: new Map()
      },

      /**
       * @prop {String[]} mods An array of mods. Add a tankIDName here so that upon server start, that account would become mod. This is not a list of mods btw.
       */

      mods: {
        value: Array.isArray(options.mods) ? options.mods : []
      },

      /**
       * @prop {String[]} admins An array of admins. Add a tankIDName here so that upon server start, that account would become admin. This is not a list of mods btw.
       */

      admins: {
        value: Array.isArray(options.admins) ? options.admins : []
      },

      /**
       * @prop {Map<Object>} tanks A map that contains all tank packet files
       */
      tanks: {
        value: new Map()
      },

      webServer: {
        value: {},
        writable: true
      }
    });

    this.netID = netID;
    this.lastID = 0;
    this.#loadCommands();
    this.#loadWorldsToCache();
    this.#loadTanks();

    if (this.autoWeb)
      this.#startWebserver();

    // get last id
    let players = [];

    for (let [k, v] of this.playersDB) {
      players.push(v);
    }

    players = players.sort((a, b) => b.id - a.id)
    .map(i => i.id);
    this.lastID = players[players.length - 1] || 0;
  }

  /**
   * Returns the current version of node-gtps you're running.
   * @readonly
   */

  get version() {
    return this.#version;
  }

  getItems() {
    return items;
  }

  /**
   * Returns the value of the private variable "isInitialized"
   * @readonly
   */

  get isInitialized() {
    return this.#isInitialized;
  }

  /**
   * A modifier to the private variable "isInitialized". This does not initialize enet.
   * @returns {undefined}
   */

  init() {
    this.#isInitialized = true;
  }

  /**
   * Returns the value of the private variable "gtps" which is the compiled c++ addon
   * @returns {Object}
   */

  getModule() {
    return this.#gtps;
  }

  /**
   * Gets the message type from the ArrayBuffer provided by the server.
   * @param {ArrayBuffer} packet The packet you received.
   * @returns {Number}
   */

  GetPacketType(packet) {
    return Buffer.from(packet).readUInt32LE();
  }

  /**
   * Decodes the packet if it was encoded with raw text.
   * @param {ArrayBuffer} packet The packet you received.
   * @returns {String}
   */

  GetMessage(packet) {
    let buffer = Buffer.from(packet);
    buffer.writeIntLE(0, buffer.length - 1, 1);

    return buffer.toString('utf-8', 4);
  }

  /**
   * Gets the hash of the items.dat
   * @param {String} location The location of the items.dat file.
   * @returns {Number}
   */

  getHash(location) {
    let h = 0x55555555;
    let file;

    try {
      file = readFileSync(location);
    } catch (e) {
      throw new Error("Can't open items.dat, maybe it's not there?");
    }

    for (let i = 0; i < file.length; i++) {
      h = (h >>> 27) + (h << 5);
    }

    return h;
  }

  /**
   * Builds the item database
   * @param {String} location The location of the items.dat file.
   * @returns {Buffer}
   */

  buildItemsDatabase(location) {
    // credits to MrAugu
    let file;
    let secret = 'PBG892FXX982ABC*';

    try {
      file = readFileSync(location);
    } catch (e) {
      throw new Error("Can't open items.dat, maybe it's not there?");
    }

    let buf = p.create(CONSTANTS.Packets.itemsDat, 60 + file.length).return();

    buf.data.writeIntLE(file.length, 56, 4);
    for (let i = 0; i < file.length; i++) {
      buf.data[60 + i] = file[i];
    }

    //return buf.data;
    let itemCount;
    let mempos = 0;
    let itemsDatVersion = 0;
    let data = file;
    let items = [];

    itemsDatVersion = data.readIntLE(mempos, 2);
    mempos += 2;
    itemCount = data.readIntLE(mempos, 4);
    mempos += 4;

    for (var k = 0; k < itemCount; k++) {
      const id = data.readIntLE(mempos, 4); // First item id
      mempos += 4;
      const editableType = data[mempos]; // Firt item editable type
      mempos += 1;
      const itemCategory = data[mempos]; // Item category (!!)
      mempos += 1;
      const actionType = data[mempos]; // Actiontype
      mempos += 1;
      const hitSoundType = data[mempos]; // Hit sound type
      mempos += 1;
      const nameLength = data.readInt16LE(mempos); // Little-Endian 16 Bit Int
      mempos += 2;

      var name = "";

      for (var i = 0; i < nameLength; i++) {
        name += String.fromCharCode(data[mempos] ^ (secret.charCodeAt((id + i) % secret.length)));
        mempos += 1;
      }

      var texture = "";
      const textureLength = data.readInt16LE(mempos);
      mempos += 2;

      for (var i = 0; i < textureLength; i++) {
        texture += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const textureHash = data.readIntLE(mempos, 4);
      mempos += 4;

      const itemKind = data[mempos];
      mempos += 1;

      const itemVal = data.readIntLE(mempos, 4);
      mempos += 4;

      const textureX = data[mempos];
      mempos += 1;

      const textureY = data[mempos];
      mempos += 1;

      const spreadType = data[mempos];
      mempos += 1;

      const isStripeyWallpaper = data[mempos];
      mempos += 1;

      const collisionType = data[mempos];
      mempos += 1;

      const breakHits = data[mempos];
      mempos += 1;

      const dropChance = data.readIntLE(mempos, 4);
      mempos += 4;

      const clothingType = data[mempos];
      mempos += 1;

      const rarity = data.readIntLE(mempos, 2);
      mempos += 2;

      const maxAmount = data[mempos];
      mempos += 1;

      const extraFileLength = data.readInt16LE(mempos);
      mempos += 2;

      var extraFile = "";
      for (var i = 0; i < extraFileLength; i++) {
        extraFile += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const extraFileHash = data.readIntLE(mempos, 4);
      mempos += 4;

      const audioVolume = data.readIntLE(mempos, 4);
      mempos += 4;

      const petNameLength = data.readInt16LE(mempos);
      mempos += 2;

      var petName = "";
      for (var i = 0; i < petNameLength; i++) {
        petName += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const petPrefixLength = data.readInt16LE(mempos);
      mempos += 2;

      var petPrefix = "";
      for (var i = 0; i < petPrefixLength; i++) {
        petPrefix += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const petSuffixLength = data.readInt16LE(mempos);
      mempos += 2;

      var petSuffix = "";
      for (var i = 0; i < petSuffixLength; i++) {
        petSuffix += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const petAbilityLength = data.readInt16LE(mempos);
      mempos += 2;

      var petAbility = "";
      for (var i = 0; i < petAbilityLength; i++) {
        petAbility += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const seedBase = data[mempos];
      mempos += 1;

      const seedOverlay = data[mempos];
      mempos += 1;

      const treeBase = data[mempos];
      mempos += 1;

      const treeLeaves = data[mempos];
      mempos += 1;


      const seedColor = data.readIntLE(mempos, 4);
      mempos += 4;

      const seedOverlayColor = data.readIntLE(mempos, 4);
      mempos += 4;

      mempos += 4; /* Ingredients Ignored */

      const growTime = data.readIntLE(mempos, 4);
      mempos += 4;

      const itemValueTwo = data.readIntLE(mempos, 2);
      mempos += 2;

      const isRayman = data.readIntLE(mempos, 2);
      mempos += 2;

      const extraOptionsLength = data.readInt16LE(mempos);
      mempos += 2;

      var extraOptions = "";
      for (var i = 0; i < extraOptionsLength; i++) {
        extraOptions += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      var textureTwo = "";
      const textureTwoLength = data.readInt16LE(mempos);
      mempos += 2;

      for (var i = 0; i < textureTwoLength; i++) {
        textureTwo += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      const extraOptionsTwoLength = data.readInt16LE(mempos);
      mempos += 2;

      var extraOptionsTwo = "";
      for (var i = 0; i < extraOptionsTwoLength; i++) {
        extraOptionsTwo += String.fromCharCode(data[mempos]);
        mempos += 1;
      }

      mempos += 80;;

      var punchOptions = "";

      if (itemsDatVersion >= 11) {
        const punchOptionsLength = data.readInt16LE(mempos);
        mempos += 2;

        for (var y = 0; y < punchOptionsLength; y++) {
          punchOptions += String.fromCharCode(data[mempos]);
          mempos += 1;
        }
      }

      const ItemObject = {
        itemID: id,
        hitSoundType: hitSoundType,
        name: name,
        texture: texture,
        textureHash: textureHash,
        val1: itemVal,
        itemKind: itemKind,
        editableType: editableType,
        itemCategory: itemCategory,
        actionType: actionType,
        textureX: textureX,
        textureY: textureY,
        spreadType: spreadType,
        isStripeyWallpaper: isStripeyWallpaper,
        collisionType: collisionType,
        breakHits: breakHits,
        dropChance: dropChance,
        clothingType: clothingType,
        rarity: rarity,
        maxAmount: maxAmount,
        extraFile: extraFile,
        extraFileHash: extraFileHash,
        audioVolume: audioVolume,
        petName: petName,
        petPrefix: petPrefix,
        petSuffix: petSuffix,
        petAbility: petAbility,
        seedColor: seedColor,
        seedBase: seedBase,
        seedOverlay: seedOverlay,
        treeBase: treeBase,
        treeLeaves: treeLeaves,
        seedOverlayColor: seedOverlayColor,
        growTime: growTime,
        val2: itemValueTwo,
        isRayman: isRayman,
        extraOptions: extraOptions,
        texture2: textureTwo,
        extraOptions2: extraOptionsTwo,
        punchOptions: punchOptions
      };

      items.push(ItemObject);
    }

    for (let item of items) {
      this.getItems().set(item.itemID, item);
    }

    return buf.data;
  }

  /**
   * Generates a world.
   * @param {String} name Name of the world to generate
   * @param {Number} width The width of the world
   * @param {Number} height The height of the world
   * @returns {Object} World data generated
   */

  generateWorld(name, width, height) {
    let world = new WorldInfo();
    world.name = name;
    world.width = width;
    world.height = height;

    for (let i = 0; i < world.width * world.height; i++) {
      world.items[i] = new WorldItem();

      if (i >= 3800 && i < 5400 && !(Math.floor(Math.random() * 50))) {
        world.items[i].foreground = 10;
      } else if (i >= 3700 && i < 5400) {
        if (i > 5000) {
          if (i % 7 == 0) {
            world.items[i].foreground = 4;
          } else {
            world.items[i].foreground = 2;
          }
        } else {
          world.items[i].foreground = 2;
        }
      } else if (i >= 5400) {
        world.items[i].foreground = 8;
      }
      if (i >= 3700)
        world.items[i].background = 14;
      if (i === 3650)
        world.items[i].foreground = 6;
      else if (i >= 3600 && i < 3700)
        world.items[i].foreground = 0;
      if (i == 3750)
        world.items[i].foreground = 8;
    }

    return world;
  }
};

// DOCS PURPOSES
/**
 * Connect Event
 *
 * @event Main#connect
 * @property {String} peerid The id of the peer that connected
 */

/**
 * Receive Event
 * Emitted when you receive data
 *
 * @event Main#receive
 * @property {Map} packet A map of received packets from the client.
 * @property {String} peerid The id of the peer that send that packet.
 */

/**
 * Disconnect Event
 * Emitted when a player leaves the game/disconnect
 * @event Main#disconnect
 * @property {String} peerid The id of the peer that disconnected.
 */

module.exports = Main;
