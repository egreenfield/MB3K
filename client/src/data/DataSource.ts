
import {DataQueryParameters, DataSet, DataQueryResult, QueryDataSet} from "./DataSet";
import {DataManager} from "./DataManager";

import * as request from "superagent";


export class DataSource {		
	queries: DataSet[];
	manager: DataManager;

	constructor() {
		this.queries = [];
	}

	setManager(manager:DataManager) {
		this.manager = manager;
	}

	newQuery(params:DataQueryParameters):DataSet {
		var newQuery = new QueryDataSet(this,params);
		this.queries.push(newQuery);
		return newQuery;
	}
	executeQuery(params:DataQueryParameters):Promise<DataQueryResult> {
		return null;
	}
}
