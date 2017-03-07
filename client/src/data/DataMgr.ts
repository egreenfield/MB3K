
import {DataSource} from "./DataSource";
import * as request from "superagent";
//TODO remove this dependency on a datasource implementation.
import AnalyticsDataSource from "./AnalyticsDataSource";
import MetricsDataSource from "./MetricsDataSource";

export default class DataMgr {		
	sources: any;
	constructor() {
		this.sources = {
			"analytics":new AnalyticsDataSource(),
			"metrics":new MetricsDataSource()
			
		};
	}
	sourceFromID(id:string):DataSource {
		return this.sources[id];
	}
}