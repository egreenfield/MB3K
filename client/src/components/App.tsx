/*
    ./client/components/App.jsx
*/
import * as React from 'react';
import DashboardView from "./DashboardView"
import Dashboard from "model/Dashboard"
import {DataManager} from "data/DataManager"
import MetricDB from "../data/MetricDB";

var getMuiTheme = require('material-ui/styles/getMuiTheme').default;
var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
var Dialog = require('material-ui/Dialog').default;
var RaisedButton = require('material-ui/RaisedButton').default;
var FlatButton = require('material-ui/FlatButton').default;

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: "deepOrange500",
    },
});

export interface AppProps {dashboard:Dashboard; manager:DataManager, metricDB:MetricDB};

export default class App extends React.Component<AppProps, {}>  {
	constructor(props:AppProps) {
		super(props);		
	}
  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
        <div>
            <FlatButton label="foo" primary={true} onTouchTap={null}/>
        <DashboardView dashboard={this.props.dashboard} metricDB={this.props.metricDB}/>

        </div>
        </MuiThemeProvider>
    );
  }
}