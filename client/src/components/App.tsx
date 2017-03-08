/*
    ./client/components/App.jsx
*/
import * as React from 'react';
import DashboardView from "./DashboardView"
import Dashboard from "model/Dashboard"
import {DataManager} from "data/DataManager"
import MetricDB from "../data/MetricDB";

export interface AppProps {dashboard:Dashboard; manager:DataManager, metricDB:MetricDB};

export default class App extends React.Component<AppProps, {}>  {
	constructor(props:AppProps) {
		super(props);		
	}
  render() {
    return (
        <DashboardView dashboard={this.props.dashboard} metricDB={this.props.metricDB}/>
    );
  }
}