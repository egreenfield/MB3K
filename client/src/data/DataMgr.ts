
import DataQuery from "./DataQuery";
import * as request from "superagent";


export default class DataMgr {		
	queries: DataQuery[];
	constructor() {
		this.queries = [];
	}
	newQuery(queryString:String) {
		var newQuery = new DataQuery(this,queryString);
		this.queries.push(newQuery);
		return newQuery;
	}
	queryByID(id:String) {
		return this.queries[0];
	}

	executeQuery(queryString:String) {
		return new Promise((fulfill, reject) => {


//			request.post("http://ec2-54-185-117-159.us-west-2.compute.amazonaws.com:9080/events/query")
			request.post("/api/events/query")
			.send(queryString)
			.set('X-Events-API-AccountName','customer1_23efd6e2-df72-4833-9e06-3ec32e9c951f')
			.set('X-Events-API-Key','52dfcafc-5672-44ac-94a6-8dc78027ec3f')
			.type('application/vnd.appd.events+text;v=1')
			.end((err,response) => {
				console.log("query response:",err,response);
		      	if (err) reject(err);
	      		else fulfill(JSON.parse(response.text));
			})
		});
	}
}