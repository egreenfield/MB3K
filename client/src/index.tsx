/*
    ./client/index.js
    which is the webpack entry file
*/
import * as React from 'react';
import * as ReactDOM  from 'react-dom';
import App from "./components/App";
import Dashboard from "./model/Dashboard"
import {DataManager} from "./data/DataManager";
import {AnalyticsDataSource} from "./data/AnalyticsDataSource";
import {MetricsDataSource} from "./data/MetricsDataSource";
import {CompoundDataSource} from "./data/CompoundDataSource";
import MetricDB from "./data/MetricDB";
let manager = new DataManager();



manager.addSource("analytics",new AnalyticsDataSource());
manager.addSource("ADC-metrics",new MetricsDataSource("AD-Capital"));			
manager.addSource("compound",new CompoundDataSource());

let dashboard = new Dashboard(manager);
dashboard.addTile();
dashboard.load();

let metricDB = new MetricDB();
metricDB.load();

ReactDOM.render(<App manager={manager} dashboard={dashboard} metricDB={metricDB} />, document.getElementById('root'));

export default {}

