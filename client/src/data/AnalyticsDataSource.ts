
import {DataQueryParameters, DataSet, SeriesResult} from "./DataSet";
import {DataSource} from "./DataSource";
import {DataManager} from "./DataManager";
import {Credentials} from "Credentials.nosave";

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
			.set('X-Events-API-AccountName',Credentials.analyticsService.accountName)
			.set('X-Events-API-Key',Credentials.analyticsService.apiKey)
			.type('application/vnd.appd.events+text;v=1')
			.end((err,response) => {
		      	if (err) reject(err);
	      		else fulfill({
					id:params.id,
					values: JSON.parse(response.text),
					name: params.queryString,
					color: "#E34471",
				  	weight:1
				});
			})
		});
	}
}
