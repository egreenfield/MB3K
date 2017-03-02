/*
    ./client/components/App.jsx
*/
import React from 'react';
import DashboardView from "./DashboardView"

export default class App extends React.Component {
	constructor(props) {
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