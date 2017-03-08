
import { EventEmitter } from "EventEmitter3";
import LineChartView from "../components/LineChartView"
import Guid from '../utils/Guid';
import DataMgr from "data/DataMgr";
import DataQuery from "data/DataQuery";

export default class Tile extends EventEmitter  {
  dataMgr:DataMgr;
  id:string;
  query:DataQuery;

  constructor(dataMgr:DataMgr) {
  	super();
  	this.dataMgr = dataMgr;
  	this.id = Guid.newGuid();

  	this.query = this.dataMgr.sourceFromID("metrics").newQuery(
  		JSON.stringify({
        application:"AD-Capital",
        metricPath:'Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)',
        timeRangeType:"BEFORE_NOW",
        durationInMins:"30",
        rollup:false
      }));

  	// this.query = this.dataMgr.sourceFromID("analytics").newQuery(
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