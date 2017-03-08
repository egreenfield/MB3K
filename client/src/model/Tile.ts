
import { EventEmitter } from "EventEmitter3";
import LineChartView from "../components/LineChartView"
import Guid from '../utils/Guid';
import {DataManager} from "data/DataManager";
import {DataQuery} from "data/DataQuery";
import {MetricsDataSource} from "data/MetricsDataSource";

export default class Tile extends EventEmitter  {
  DataManager:DataManager;
  id:string;
  query:DataQuery;

  constructor(DataManager:DataManager) {
  	super();
  	this.DataManager = DataManager;
  	this.id = Guid.newGuid();

  	this.query = (this.DataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery({
        id: Guid.newGuid(),
        metricPath:'Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)',
        timeRangeType:"BEFORE_NOW",
        durationInMins:30,
        rollup:false
      });

  	// this.query = this.DataManager.sourceFromID("analytics").newQuery(
  	// 	`SELECT transactionName AS "Business Transaction", count(segments.errorList.errorCode) AS "Error Code (Count)" FROM transactions`);

  	this.query.on("loadComplete",() => this.emit("change"));
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