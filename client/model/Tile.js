
import uuid from 'uuid';
import EventEmitter from "eventemitter3";
import BarChartView from "../components/BarChartView"
export default class Tile extends EventEmitter  {
  constructor(dataMgr) {
  	super();
  	this.dataMgr = dataMgr;
  	this.id = uuid();
  	this.query = this.dataMgr.newQuery(
  		`SELECT transactionName AS "Business Transaction", count(segments.errorList.errorCode) AS "Error Code (Count)" FROM transactions`);
  	this.query.on("loadComplete",() => this.emit("change"));
  }

  getState() {return this.query.state;}

  load() {
  	this.query.load();
  }

  getID() {return this.id}
  getVizType() {return BarChartView}
  getData() {return this.query.getData();}
}