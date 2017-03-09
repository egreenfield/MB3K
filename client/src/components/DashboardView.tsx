import * as React from 'react';
import TileView from './TileView';
import Dashboard from 'model/Dashboard'
import {Tile} from 'model/Tile';
import MetricDB from "../data/MetricDB";

export interface DashboardViewProps {dashboard:Dashboard, metricDB:MetricDB}

export default class DashboardView  extends  React.Component<DashboardViewProps, {}>  {
	constructor(props:DashboardViewProps) {
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
	     	{this.props.dashboard.getTiles().map((tile:Tile) => <TileView tile={tile} key={tile.getID()} metricDB={this.props.metricDB} />)}
	     </div>
	 </div>
    );
  }

}
