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
        <div>
            <div className="navbar navbar-inverse navbar-fixed-top">
                <div className="navbar-inner">
                    <div className="container-fluid">

                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row-fluid">
                    <div className="span3">
                        <input type="text"></input>
                    </div>
                    <div className="span9">
                        <div className="row-fluid">
                            <div className="span12">
                                <DashboardView dashboard={this.props.dashboard} metricDB={this.props.metricDB}/>
                            </div>
                        </div>
                        <div className="row-fluid">
                            <div className="span12">
                                Controls
                            </div>
                        </div>
                    </div>
                </div>

                <hr></hr>

                <footer>
                    <p>Adam, Binil, Ely, Meili</p>
                </footer>
            </div>
        </div>
    );
  }
}