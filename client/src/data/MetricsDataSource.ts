
import {DataQueryParameters, DataSet,SeriesResult } from "./DataSet";
import {DataSource} from "./DataSource";
import * as request from "superagent";
import * as _ from "underscore";
import {DataManager} from "./DataManager";
import {Credentials} from "../Credentials.nosave";

export interface MetricsQueryParameters extends DataQueryParameters {
	id:string;
	metricPath:string;
	timeRangeType:string;
	startTime?:any;
	endTime?:any;
	durationInMins?:number;
	offsetInMins?:number;
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

		if(params.offsetInMins) {
			let offsetInMilli = params.offsetInMins*60*1000;
			params = (Object as any).assign({},params);
			if (params.startTime) params.startTime -= offsetInMilli;
			if (params.endTime) params.endTime -= offsetInMilli;
			if (params.timeRangeType == "BEFORE_NOW") {
				params.startTime = (new Date).getTime() - offsetInMilli;
				params.timeRangeType = "BEFORE_TIME";
			}
		}

		// HACK ALERT.
		params.metricPath = 'Application Infrastructure Performance|lemminghost|Hardware Resources|CPU|%Busy';

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
            .auth(Credentials.metricService.username, Credentials.metricService.password) /* OAFLAG */
			.end((err,response) => {
		      	if (err) reject(err);
	      		else {
					let data = JSON.parse(response.text)[0];
					if(params.offsetInMins) {
						let offsetInMilli = params.offsetInMins*60*1000;
						data.metricValues = data.metricValues.forEach((e:any) => {
							e.startTimeInMillis += offsetInMilli;
						});
					}
					// console.log("requested ",new Date(params.startTime), new Date(params.endTime));
					// console.log("got back", data.metricValues.map((v:any) => new Date(v.startTimeInMillis)));
					fulfill({
						id:params.id,
						values:data.metricValues,
						name:params.metricPath,
						color: "#E34471",
						weight:1
					});
				}
			})
		});
	}
}
