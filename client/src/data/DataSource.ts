
import {DataQueryParameters, DataQuery, DataQueryResult} from "./DataQuery";
import * as request from "superagent";


export interface DataSource {		
	newQuery(params:DataQueryParameters):DataQuery;

	executeQuery(params:DataQueryParameters):Promise<DataQueryResult>;
}
