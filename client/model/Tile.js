
import uuid from 'uuid';
export default class Tile  {
  constructor(dataMgr) {
  	this.dataMgr = dataMgr;
  	this.id = uuid();
  	this.query = this.dataMgr.newQuery(
  		`SELECT transactionName AS "Business Transaction", 
  				count(segments.errorList.errorCode) AS "Error Code (Count)" 
  		FROM transactions`);

  }
  getID() {return this.id}
}