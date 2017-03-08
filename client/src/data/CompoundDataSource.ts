
import {DataQueryParameters, DataQuery, QueryDefinition, CompoundSeriesResult} from "./DataQuery";
import {DataSource} from "./DataSource";
import {DataManager} from "./DataManager"; 


export interface CompoundQueryParameters extends DataQueryParameters {
	id?:string;
	subQueries:QueryDefinition[];
};

export class CompoundDataSource implements DataSource {		
	queries: DataQuery[];
	manager: DataManager;

	constructor() {
		this.queries = [];
	}

		setManager(manager:DataManager) {
			this.manager = manager;
		}

	newQuery(params:CompoundQueryParameters):DataQuery {
		var newQuery = new DataQuery(this,params);
		this.queries.push(newQuery);
		return newQuery;
	}
	queryByID(id:String) {
		return this.queries[0];
	}

	executeQuery(params:CompoundQueryParameters):Promise<CompoundSeriesResult> {
		
		// return new Promise<CompoundSeriesResult>((fulfill, reject) => {
		 	var ps = [];
			for(let aQuery of params.subQueries) {
				let source = this.manager.sourceFromID(aQuery.source);
				ps.push(source.executeQuery(aQuery.parameters);
			}					
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
		return null;
	}
}
