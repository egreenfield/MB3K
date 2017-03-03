
import EventEmitter from "eventemitter3";

export default class DataQuery extends EventEmitter {

	constructor(mgr,queryString) {
		super();
		this.mgr = mgr;
		this.queryString = queryString;
		this.state = "unloaded";
	}

	getState() {return this.state}
	load() {
		switch(this.state) {
			case "loading":
			case "loaded":			
				break;
			case "unloaded":
				this.state = "loading";
				this.mgr.executeQuery(this.queryString).then((data) => {
					this.data = data;
					this.state = "loaded";
					this.emit("loadComplete");
				});
		}
	}
	getData() {return this.data;}
}