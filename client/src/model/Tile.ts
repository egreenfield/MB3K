
import { EventEmitter } from "EventEmitter3";
import LineChartView from "../components/LineChartView"
import Guid from '../utils/Guid';
import {DataManager} from "data/DataManager";
import {DataSet} from "data/DataSet";
import {MetricsDataSource, MetricsQueryParameters} from "data/MetricsDataSource";
import {CompoundDataSource} from "data/CompoundDataSource";
import {FormulaDataSet} from "../data/FormulaDataSet";

export default class Tile extends EventEmitter  {
  dataManager:DataManager;
  id:string;
  query:DataSet;

  constructor(DataManager:DataManager) {
  	super();
  	this.dataManager = DataManager;
  	this.id = Guid.newGuid();

  	// this.query = (this.dataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery({
    //     id: Guid.newGuid(),
    //     metricPath:'Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)',
    //     timeRangeType:"BEFORE_NOW",
    //     durationInMins:30,
    //     rollup:false
    //   });

    this.query = new FormulaDataSet({
      inputs: [
        {
          name: "A",
          valueField:"value",
          dataSet: (this.dataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery({
            id: Guid.newGuid(),
            metricPath:'Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)',
            timeRangeType:"BEFORE_NOW",
            durationInMins:30,
            rollup:false
          })
        },
        {
          name: "B",
          valueField:"value",
          dataSet: (this.dataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery({
            id: Guid.newGuid(),
            metricPath:'Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average CPU Used (ms)',
            timeRangeType:"BEFORE_NOW",
            durationInMins:30,
            rollup:false
          })
        }
      ],
      indexField: "startTimeInMillis",
      formulas: [
        {
          name:"C",
          expression: "(A+B)/2",
          valueField:"value"
        }
      ]
    });

    //   }
    //   subQueries: [
    //     {
    // 		  source:"ADC-metrics",
		//       parameters:{
    //         id: Guid.newGuid(),
    //         metricPath:'Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)',
    //         timeRangeType:"BEFORE_NOW",
    //         durationInMins:30,
    //         rollup:false            
    //       } as MetricsQueryParameters          
    //     },
    //     {
    // 		  source:"ADC-metrics",
		//       parameters:{
    //         id: Guid.newGuid(),
    //         metricPath:'Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average CPU Used (ms)',
    //         timeRangeType:"BEFORE_NOW",
    //         durationInMins:30,
    //         rollup:false            
    //       } as MetricsQueryParameters          
    //     }
        
    //   ]    
    // });

    
  	// this.query = this.dataManager.sourceFromID("analytics").newQuery(
  	// 	`SELECT transactionName AS "Business Transaction", count(segments.errorList.errorCode) AS "Error Code (Count)" FROM transactions`);

  	this.query.on("stateChange",() => this.emit("change"));
  }

  getState() {return this.query.state;}

  load() {
  	this.query.load();
  }

  getID() {return this.id}
  // shouldn't be returning a viz class from a model class, should be returning an id that can be resolved to a class.
  getVizType():any {return LineChartView}
  getData() { 
    return this.query.getData();  
  }
}