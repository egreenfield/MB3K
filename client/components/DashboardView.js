
import React from 'react';
import TileView from './TileView';


export default class DashboardView  extends React.Component { 
	constructor(props) {
		super(props);		
		props.dashboard.on("change",() => {
			this.forceUpdate();
		});
	}
  render() {
    return (
     <div>
     	<div style={{textAlign: 'center'}}>
        	<h1>{this.props.dashboard.name}</h1>
     	 </div>
	     <div>
	     	{this.props.dashboard.getTiles().map((tile) => <TileView tile={tile} key={tile.getID()} />)}
	     </div>
	 </div>
    );
  }

}
