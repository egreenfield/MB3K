
import { EventEmitter } from "EventEmitter3";
import DataMgr from "data/DataMgr";
import {DataSource} from "data/DataSource";


export interface DataQueryResult { id:string; }
export interface ScalarResult extends DataQueryResult {
	name:String;
	value:Number;
};

export interface SeriesResult {
	name:string;
	results:any[];
};

export interface CompoundSeriesResult extends DataQueryResult {
	series:SeriesResult[];
};

export interface DataQueryParameters {
	id:string;
};

export class DataQuery extends EventEmitter {
	source:DataSource;
	queryParams:DataQueryParameters;
	state:string;
	data:DataQueryResult;

	constructor(source:DataSource,queryParams:DataQueryParameters) {
		super();
		this.source= source;
		this.queryParams = queryParams;
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
				this.source.executeQuery(this.queryParams).then((data:any) => {
					this.data = data;
					this.state = "loaded";
					this.emit("loadComplete");
				});
		}
	}
	getData():DataQueryResult {
		return this.data;
	}
}