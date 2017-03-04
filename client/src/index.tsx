/*
    ./client/index.js
    which is the webpack entry file
*/
import * as React from 'react';
import * as ReactDOM  from 'react-dom';
import App from "./components/App";
import Dashboard from "./model/Dashboard"
import DataMgr from "./data/DataMgr";
var dataMgr = new DataMgr();
var dashboard = new Dashboard(dataMgr);


dashboard.addTile();
dashboard.load();

ReactDOM.render(<App dataMgr={dataMgr} dashboard={dashboard} />, document.getElementById('root'));

export default {}

