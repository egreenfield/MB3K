
import Tile from "./Tile"
import { EventEmitter } from "EventEmitter3";
import {DataManager} from "data/DataManager";

export default class Dashboard extends EventEmitter {
	name : String;
	DataManager : DataManager;
	tiles:Tile[];


	constructor(DataManager:DataManager) {
		super();
		this.tiles = [
		];
		this.name = "New Dashboard";
		this.DataManager = DataManager;
	}

	addTile() {
		
		var newTile = new Tile(this.DataManager);
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