const CONSTANTS = require('./structs/Constants');

/**
 * @class PacketCreator makes the syntax for making packets so much easier.
 * @prop {Buffer} data The packet data that was created
 * @prop {Number} len Length of the packet
 * @prop {Number} indexes
 */

class PacketCreator {
  constructor() {
    this.data;
    this.len = 0;
    this.indexes = 0;
  }

  /**
   * Creates a packet with specific packet headers and the given length.
   * @param {String} string The Packet Header to use.
   * @param {Number} length The length of the packet to create
   * @returns {PacketCreator}
   */

  create(string, length) {
    if (!string)
      string = CONSTANTS.Packets.default;

    if (!length)
      length = 61;

    this.data = Buffer.alloc(length);
    this.len = length;

    let i = 0;
    while (i < this.len) {
      let hex = parseInt(string[i], 16);
      hex = hex << 4;
      hex += parseInt(string[i + 1], 16);

      this.data.writeUIntLE(hex, (i / 2), 1);

      i += 2;
    }

    return this;
  }

  /**
   * Adds a string to the packet, along with the index and string length
   * @param {String} string The string to add to the packet
   * @returns {PacketCreator}
   */

  string(string) {
    let data = Buffer.alloc(this.len + 2 + string.length + 4);
    let i = 0;

    while (i < data.length) {
      data[i] = this.data[i] || 0;
      i++;
    }

    data.writeUIntLE(this.indexes, this.len, 1);
    data.writeUIntLE(2, this.len + 1, 1);
    data.writeUIntLE(string.length, this.len + 2, 4);
    data.write(string, this.len + 6, string.length);
    this.len = this.len + 2 + string.length + 4;
    this.indexes++;

    this.data = data;

    return this;
  }

  /**
   * Adds a int to the packet, along with the index
   * @param {Number} val The number to add to the packet
   * @returns {PacketCreator}
   */

  int(val) {
    let data = Buffer.alloc(this.len + 6);
    let i = 0;

    while (i < data.length) {
      data[i] = this.data[i] || 0;
      i++;
    }

    data.writeUIntLE(this.indexes, this.len, 1);
    data.writeUIntLE(9, this.len + 1, 1);
    data.writeUIntLE(val, this.len + 2, 4);
    this.len = this.len + 6;
    this.indexes++;

    this.data = data;

    return this;
  }

  /**
   * Same as `PacketCreator#int` but instead, this places the packet length at offset 5 instead of 9.
   * @param {Number} val The number to add to the packet
   * @returns {PacketCreator}
   */

  intx(val) {
    let data = Buffer.alloc(this.len + 6);
    let i = 0;

    while (i < data.length) {
      data[i] = this.data[i] || 0;
      i++;
    }

    data.writeUIntLE(this.indexes, this.len, 1);
    data.writeUIntLE(5, this.len + 1, 1);
    data.writeUIntLE(val, this.len + 2, 4);
    this.len = this.len + 6;
    this.indexes++;

    this.data = data;

    return this;
  }

  /**
   * Ends the packet by adding the indexes to specifc offsets and adding `00` to the end of the packet.
   * @returns {PacketCreator}
   */

  end() {
    this.data = Buffer.concat([this.data, Buffer.from([0x00])]);
    this.len++;

    this.data.writeUIntLE(this.indexes, 56, 1);
    this.data.writeUIntLE(this.indexes, 60, 1);

    return this;
  }
  
  /**
   * Appends floats to the packet
   * @param {Float} val The fist float to append
   * @param {Float} val2 The second float to append
   * @param {Float} val3 The third float to append
   * @returns {PacketCreator}
   */

  float(val, val2, val3) {
    let addLen = 0;
    let addLen2 = 0;

    let data = Buffer.alloc(this.len + 14);
    let i = 0;

    while (i < data.length) {
      data[i] = this.data[i] || 0;
      i++;
    }

    addLen = 4;
    addLen2 = 12;

    data.writeUIntLE(this.indexes, this.len, 1);
    data.writeUIntLE(addLen, this.len + 1, 1);
    data.writeFloatLE(val, this.len + 2, 4);
    data.writeFloatLE(val2, this.len + 6, 4);
    data.writeFloatLE(val3, this.len + 10, 4);

    this.len = this.len + 2 + addLen2;
    this.indexes++;

    this.data = data;
    return this;
  }

  /**
   * Reconstructs the packet. Does not create a new instance, it just resets all data of the packet.
   * @returns {PacketCreator}
   */

  reconstruct() {
    this.data = null;
    this.len = 0;
    this.indexes = 0;
    return this;
  }

  /**
   * Returns the PacketCreator along with it's accessible data.
   * @returns {PacketCreator}
   */

  return() {
    return this;
  }

  /**
   * Creates a new instance of PacketCreator
   * @returns {PacketCreator}
   */

  new() {
    return new PacketCreator();
  }
};

module.exports = PacketCreator;
