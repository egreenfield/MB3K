/*
    ./client/components/App.jsx
*/
import * as React from 'react';
import DashboardView from "./DashboardView"
import Dashboard from "model/Dashboard"
import {DataManager} from "data/DataManager"

export interface AppProps {dashboard:Dashboard; manager:DataManager};

export default class App extends React.Component<AppProps, {}>  {
	constructor(props:AppProps) {
		super(props);		
	}
  render() {
    return (
     <div style={{textAlign: 'center'}}>
        <h1>Hello World</h1>
        <DashboardView dashboard={this.props.dashboard}/>
      </div>);
  }
}