
import {DataSource} from "./DataSource";
import * as request from "superagent";
//TODO remove this dependency on a datasource implementation.
import {AnalyticsDataSource} from "./AnalyticsDataSource";
import {MetricsDataSource} from "./MetricsDataSource";

export class DataManager {		
	sources: any;
	constructor() {
	}
	addSource(name:string,source:DataSource) {
		this.sources.push(source);
		source.setManager(this);
	}

	sourceFromID(id:string):DataSource {
		return this.sources[id];
	}
}