const PlayerInventory = require('./PlayerInventory');
const Constants = require('./Constants');

class PlayerInfo {
	#main;
	constructor(main) {
		this.#main = main;
		this.id = 0;
		this.netID = 0;
		this.tankIDName = "";
		this.tankIDPass = "";
		this.requestedName = "";
		this.displayName = "";
		this.rawName = "";
		this.properName = "";
		this.country = "";
		this.email = "";
		this.registeredName = "";
		this.currentWorld = "EXIT";
		this.x = 0;
		this.y = 0;
		this.x1 = 0;
		this.y1 = 0;
		this.ip = "";
		this.mac = "";
		this.inventory = new PlayerInventory();
		this.platformID = 0;
		this.player_age = "";
		this.game_version = "";
		this.isGuest = false;
		this.permissions = 0;
		this.roles = [];
		this.temp = {
			peerid: "",
			MovementCount: 0
		};
		this.friends = [];

		this.clothes = {
			hair: 0,
			shirt: 0,
			pants: 0,
			feet: 0,
			hand: 0,
			back: 0,
			mask: 0,
			necklace: 0,
			ances: 0
		};

		this.skinColor = 0x8295C3FF;
		this.hasClothesUpdated = false;

		this.states = [];
		this.punchEffects = ["Fist"];
		this.worldsOwned = [];
		this.gems = 0;
		this.isLegend = 0;
	}

	addState(state) {
		if (!this.states.includes(state))
			this.states.push(state);

		this.#main.players.set(this.temp.peerid, this)
	}

	getState() {
		let state = 0;

		state |= this.states.includes('canWalkInBlocks') << 0;
		state |= this.states.includes('canDoubleJump') << 1;
		state |= this.states.includes('isInvis') << 2;

		return state;
	}

	removeState(state) {
		this.states = this.states.filter(s => s !== state);
		this.#main.players.set(this.temp.peerid, this);
	}

	addPunchEffect(effect) {
		if (Constants.ItemEffects[effect] && !this.punchEffects.includes(effect))
			this.punchEffects.push(effect);

		this.#main.players.set(this.temp.peerid, this);
	}

	removePunchEffect(effect) {
		if (this.punchEffects.includes(effect))
			this.punchEffects = this.punchEffects.filter(p => p.toLowerCase() !== effect.toLowerCase());

		this.#main.players.set(this.temp.peerid, this);
	}

	addRole(role) {
		if (this.roles.includes(role)) return;

		let perm = Constants.Permissions[role];

		if (perm) {
			this.permissions |= perm;
			this.roles.push(role);
		};

		this.#main.players.set(this.temp.peerid, this);
	}

	removeRole(role) {
		if (!this.roles.includes(role)) return;
		let perm = Constants.Permissions[role];

		if (perm) {
			this.permissions ^= perm;
			this.roles = this.roles.filter(r => r !== role);
		}

		this.#main.players.set(this.temp.peerid, this);
	}
};

module.exports = PlayerInfo;
