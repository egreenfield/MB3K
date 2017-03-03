/*
    ./client/index.js
    which is the webpack entry file
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import Dashboard from "./model/Dashboard"
import DataMgr from "./data/DataMgr.js";
var dataMgr = new DataMgr();
var dashboard = new Dashboard(dataMgr);


dashboard.addTile();
dashboard.load();

ReactDOM.render(<App dataMgr={dataMgr} dashboard={dashboard} />, document.getElementById('root'));

