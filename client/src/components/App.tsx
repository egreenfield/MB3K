/*
    ./client/components/App.jsx
*/
import * as React from 'react';
import DashboardView from "./DashboardView"
import Dashboard from "model/Dashboard"
import DataMgr from "data/DataMgr"

export interface AppProps {dashboard:Dashboard; dataMgr:DataMgr}

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