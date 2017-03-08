
import {DataQueryParameters, DataQuery, DataQueryResult} from "./DataQuery";
import {DataManager} from "./DataManager";

import * as request from "superagent";


export interface DataSource {		
	newQuery(params:DataQueryParameters):DataQuery;

	setManager(mgr:DataManager):void;

	executeQuery(params:DataQueryParameters):Promise<DataQueryResult>;
}
