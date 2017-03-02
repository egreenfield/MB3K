
import DataQuery from "./DataQuery";


export default class DataMgr {	
	constructor() {
		this.queries = [];
	}
	newQuery(queryString) {
		var newQuery = new DataQuery(this,queryString);
		this.queries.push(newQuery);
		return newQuery;
	}
	queryByID(id) {
		return this.queries[0];
	}
}