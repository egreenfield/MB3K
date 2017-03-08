
import { EventEmitter } from "EventEmitter3";
import {DataManager} from "./DataManager";
import {DataSource} from "./DataSource";


export interface DataQueryResult { id:string; }
export interface ScalarResult extends DataQueryResult {
	name:String;
	value:Number;
};

export interface SeriesResult extends DataQueryResult {
	name:string;
	values:any[];
};

export interface CompoundSeriesResult extends DataQueryResult {
	series:SeriesResult[];
};

export interface DataQueryParameters {
	id?:string;
};

export interface QueryDefinition {
		source:string;
		parameters:DataQueryParameters;	
};


export class DataSet extends EventEmitter {
	state:string;

	constructor() {
		super();
		this.state = "unloaded";
	}

	getState() {return this.state}
	setState(state:string) {
		if(this.state == state)
			return;
		this.state = state;
		this.emit("stateChange",state);		
	}
	load() {
	}

	getData():any {
		return null
	}
}

export class QueryDataSet extends DataSet {
	source:DataSource;
	queryParams:DataQueryParameters;
	data:DataQueryResult;

	constructor(source:DataSource,queryParams:DataQueryParameters) {
		super();
		this.source= source;
		this.queryParams = queryParams;
	}

	getState() {return this.state}
	load() {
		switch(this.state) {
			case "loading":
			case "loaded":			
				break;
			case "unloaded":
				this.setState("loading");
				this.source.executeQuery(this.queryParams).then((data:any) => {
					this.data = data;
					this.setState("loaded");
				});
		}
	}
	getData():DataQueryResult {
		return this.data;
	}
}