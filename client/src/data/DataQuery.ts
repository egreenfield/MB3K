
import { EventEmitter } from "EventEmitter3";
import DataMgr from "data/DataMgr";
import {DataSource} from "data/DataSource";

export default class DataQuery extends EventEmitter {
	source:DataSource;
	queryString:String;
	state:String;
	data:Object;

	constructor(source:DataSource,queryString:String) {
		super();
		this.source= source;
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
				this.source.executeQuery(this.queryString).then((data:any) => {
					this.data = data;
					this.state = "loaded";
					this.emit("loadComplete");
				});
		}
	}
	getData() {return this.data;}
}