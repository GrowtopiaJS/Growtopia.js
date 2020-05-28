class WorldInfo {
  constructor() {
    this.name;
    this.width = 100;
    this.height = 60;
    this.isPublic = false;
    this.owner = {};
    this.items = [];
    this.players = [];
    this.signs = [];
    this.bannedPlayers = [];
    this.bannedGuests = [];
    this.weather = "";
    this.bpm = 0;
  }
};

module.exports = WorldInfo;