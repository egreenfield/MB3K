
import {DataQueryParameters, DataSet,SeriesResult } from "./DataSet";
import {DataSource} from "./DataSource";
import * as request from "superagent";
import * as _ from "underscore";
import {DataManager} from "./DataManager";

export interface MetricsQueryParameters extends DataQueryParameters {
	id:string;
	metricPath:string;
	timeRangeType:string;
	startTime?:any;
	endTime?:any;
	durationInMins?:Number;
	rollup:boolean;	
};

export class MetricsDataSource extends DataSource {		
	application:string;
	constructor(application:string) {
		super();
		this.application = application;
	}
	newQuery(params:MetricsQueryParameters):DataSet {
		return super.newQuery(params);
	}

	executeQuery(params:MetricsQueryParameters):Promise<SeriesResult> {

        let urlBase = "http://localhost:8080/api/metrics/";//http://ec2-23-20-138-216.compute-1.amazonaws.com:8090/controller/rest/"
        let url = urlBase + "applications/" + this.application + "/metric-data";

		return new Promise<SeriesResult>((fulfill, reject) => {
			request.get(url)
            .query({
                "metric-path":params.metricPath,
                "time-range-type":params.timeRangeType,
                "start-time":params.startTime,
                "end-time":params.endTime,
                "duration-in-mins":params.durationInMins,
				"rollup":params.rollup,
                "output":"json"
            })
            .auth('amodgupta@customer1', 'welcome-101')
			.end((err,response) => {
		      	if (err) reject(err);
	      		else {
					let data = JSON.parse(response.text)[0];
					fulfill({
						id:params.id,
						values:data.metricValues,
						name:params.metricPath
					});
				}
			})
		});
	}
}
