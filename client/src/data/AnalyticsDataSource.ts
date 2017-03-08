
import {DataQueryParameters, DataQuery } from "./DataQuery";
import {DataSource} from "./DataSource";

import * as request from "superagent";

export interface AnalyticsQueryParameters extends DataQueryParameters {
	queryString:string;
	id:string;
};

export class AnalyticsDataSource implements DataSource {		
	queries: DataQuery[];

	constructor() {
		this.queries = [];
	}
	newQuery(params:AnalyticsQueryParameters):DataQuery {
		var newQuery = new DataQuery(this,params);
		this.queries.push(newQuery);
		return newQuery;
	}
	queryByID(id:String) {
		return this.queries[0];
	}

	executeQuery(params:AnalyticsQueryParameters) {
		return new Promise((fulfill, reject) => {

			request.post("/api/events/query")
			.send(params.queryString)
			.set('X-Events-API-AccountName','customer1_23efd6e2-df72-4833-9e06-3ec32e9c951f')
			.set('X-Events-API-Key','52dfcafc-5672-44ac-94a6-8dc78027ec3f')
			.type('application/vnd.appd.events+text;v=1')
			.end((err,response) => {
		      	if (err) reject(err);
	      		else fulfill({
					  id:params.id,
					  series: [{
						  results: JSON.parse(response.text),
						  name: params.queryString
					  }]
				  });
			})
		});
	}
}
