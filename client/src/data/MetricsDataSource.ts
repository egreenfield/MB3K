
import DataQuery from "./DataQuery";
import {DataSource} from "./DataSource";
import * as request from "superagent";
import * as _ from "underscore";

export default class AnalyticsDataSource implements DataSource {		
	queries: DataQuery[];

	constructor() {
		this.queries = [];
	}
	newQuery(queryString:String):DataQuery {
		var newQuery = new DataQuery(this,queryString);
		this.queries.push(newQuery);
		return newQuery;
	}

	executeQuery(queryString:string) {
        let props = JSON.parse(queryString);        


        let urlBase = "http://localhost:8080/api/metrics/";//http://ec2-23-20-138-216.compute-1.amazonaws.com:8090/controller/rest/"
        let url = urlBase + "applications/" + props.application + "/metric-data";

		return new Promise((fulfill, reject) => {
			request.get(url)
            .query({
                "metric-path":props.metricPath,
                "time-range-type":props.timeRangeType,
                "start-time":props.startTime,
                "end-time":props.endTime,
                "duration-in-mins":props.durationInMins,
				"rollup":props.rollup,
                "output":"json"
            })
            .auth('amodgupta@customer1', 'welcome-101')
			.end((err,response) => {
		      	if (err) reject(err);
	      		else {
					let data = JSON.parse(response.text)[0];
				  	data.results = data.metricValues;
				  	delete data.metricValues;
					fulfill(data);
				}
			})
		});
	}
}
