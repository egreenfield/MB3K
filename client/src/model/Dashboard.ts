
import Tile from "./Tile"
import { EventEmitter } from "EventEmitter3";
import DataMgr from "data/DataMgr";

export default class Dashboard extends EventEmitter {
	name : String;
	dataMgr : DataMgr;
	tiles:Tile[];


	constructor(dataMgr:DataMgr) {
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