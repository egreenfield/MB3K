
import {DataQueryParameters, DataSet, 
	QueryDefinition, CompoundSeriesResult, 
	SeriesResult, DataQueryResult} from "./DataSet";
import {DataSource} from "./DataSource";
import {DataManager} from "./DataManager"; 


export interface CompoundQueryParameters extends DataQueryParameters {
	id?:string;
	subQueries:QueryDefinition[];
};

export class CompoundDataSource extends DataSource {		
	constructor() {
		super();
	}
	newQuery(params:CompoundQueryParameters):DataSet {
		return super.newQuery(params);
	}

	executeQuery(params:CompoundQueryParameters):Promise<CompoundSeriesResult> {
		
		 return new Promise<CompoundSeriesResult>((fulfill, reject) => {
		 	var ps = [];
			for(let aQuery of params.subQueries) {
				let source = this.manager.sourceFromID(aQuery.source);
				ps.push(source.executeQuery(aQuery.parameters));
			}					
			Promise.all<DataQueryResult>(ps).then(values => {
				console.log("values are",values);
				let result = {
					id:params.id,
					series: [] as SeriesResult[]
				};
				(values as CompoundSeriesResult[]).forEach( subResult=> {
					result.series = result.series.concat(subResult.series);
				})
				fulfill(result);
			},reason => {
				reject(reason);
			});
		 });
		// 	request.post("/api/events/query")
		// 	.send(params.queryString)
		// 	.set('X-Events-API-AccountName','customer1_23efd6e2-df72-4833-9e06-3ec32e9c951f')
		// 	.set('X-Events-API-Key','52dfcafc-5672-44ac-94a6-8dc78027ec3f')
		// 	.type('application/vnd.appd.events+text;v=1')
		// 	.end((err,response) => {
		//       	if (err) reject(err);
	    //   		else fulfill({
		// 			  id:params.id,
		// 			  series: [{
		// 				  values: JSON.parse(response.text),
		// 				  name: params.queryString
		// 			  }]
		// 		  });
		// 	})
		// });
	}
}
