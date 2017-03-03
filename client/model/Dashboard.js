
import Tile from "./Tile"
import EventEmitter from "eventemitter3";

export default class Dashboard extends EventEmitter {


	constructor(dataMgr) {
		super();
		this.tiles = [
		];
		this.name = "New Dashboard";
		this.dataMgr = dataMgr;
	}

	addTile() {
		var newTile = new Tile(this.dataMgr);
		newTile.on("change",() => {this.emit("change")});
		this.tiles.push(newTile);
		this.emit("change");
		return newTile;
	}
	getTiles() {
		return this.tiles.concat();
	}

	load() {
		for (var aTile of this.tiles) {
			aTile.load();
		}
	}

}