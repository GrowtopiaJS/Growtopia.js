class WorldItem {
	constructor() {
		this.foreground = 0;
		this.background = 0;
		this.breakLevel = 0;
		this.breakTime = 0;
		this.water = false;
		this.fire = false;
		this.glue = false;
		this.red = false;
		this.green = false;
		this.blue = false;
		this.lastPunched = 0;
		this.resetIn = 0;
		this.interval = -1;
	}
};

module.exports = WorldItem;
