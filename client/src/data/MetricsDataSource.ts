
import {DataQueryParameters, DataSet,SeriesResult } from "./DataSet";
import {DataSource} from "./DataSource";
import * as request from "superagent";
import * as _ from "underscore";
import {DataManager} from "./DataManager";
import {Credentials} from "../Credentials.nosave";
import { simplify } from "../utils/simplify";
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

const hashCode = function(str:string){
    var hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

const reduceBy = function(values:DataPoint[],bucketCount:number) {
	let oldLen = values.length; 
//	console.log("simplifying");
	//						data.metricValues = simplify(data.metricValues,3.5,false);


	let accumulator = (values as any).reduce( (n:{result:DataPoint[], current:DataPoint, count:number},v:DataPoint,i:number) => {
		n.current.value = Math.max(n.current.value,v.value);
		n.current.startTimeInMillis = v.startTimeInMillis;
		n.count++;
	//							let hashValue = hashCode(""+v.startTimeInMillis) ;
		let hashValue = Math.floor(v.startTimeInMillis / (60*1000));
	//							console.log("hash:",i,v.startTimeInMillis,hashValue);
		if((hashValue % bucketCount) == 0) {
	//							if(n.count == bucketCount) {
			n.result.push({value:n.current.value/*/n.count*/,startTimeInMillis:n.current.startTimeInMillis});
			n.current.value = 0;
			n.count = 0;
		}
		return n;
	},{result:[], current:{value:0,timeInMillis:0},count:0})
	return accumulator.result;
}
interface DataPoint {
	value:number;
	startTimeInMillis:number;
}

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
					let maxCount = 250;
					let maxPointsRendered = (params.endTime - params.startTime)/(60*1000);
					let originalPoints = maxPointsRendered;
					let bucketSize = 2;
					while(maxPointsRendered > maxCount) {
						data.metricValues = reduceBy(data.metricValues,bucketSize);
						maxPointsRendered /= 2;
						bucketSize *= 2;
					}
//						console.log(`simplified from ${originalPoints} to ${data.metricValues.length}`);
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
