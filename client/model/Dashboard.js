
import Tile from "./Tile"

export default class Dashboard {


	constructor(dataMgr) {
		this.tiles = [
			new Tile(dataMgr)
		];
		this.name = "New Dashboard";
	}

	getTiles() {
		return this.tiles.concat();
	}

}