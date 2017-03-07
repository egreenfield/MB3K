
import DataQuery from "./DataQuery";
import * as request from "superagent";


export interface DataSource {		
	newQuery(queryString:String):DataQuery;

	executeQuery(queryString:String):Promise<any>;
}
