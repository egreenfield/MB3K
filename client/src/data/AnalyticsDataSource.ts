
import {DataQueryParameters, DataSet, SeriesResult} from "./DataSet";
import {DataSource} from "./DataSource";
import {DataManager} from "./DataManager";

import * as request from "superagent";

export interface AnalyticsQueryParameters extends DataQueryParameters {
	queryString:string;
	id:string;
};

export class AnalyticsDataSource extends DataSource {		
	constructor() {
		super();
	}

	executeQuery(params:AnalyticsQueryParameters):Promise<SeriesResult> {
		return new Promise<SeriesResult>((fulfill, reject) => {

			request.post("/api/events/query")
			.send(params.queryString)
			.set('X-Events-API-AccountName','customer1_23efd6e2-df72-4833-9e06-3ec32e9c951f')
			.set('X-Events-API-Key','52dfcafc-5672-44ac-94a6-8dc78027ec3f')
			.type('application/vnd.appd.events+text;v=1')
			.end((err,response) => {
		      	if (err) reject(err);
	      		else fulfill({
					id:params.id,
					values: JSON.parse(response.text),
					name: params.queryString,
					color: "#E34471"
				  });
			})
		});
	}
}
