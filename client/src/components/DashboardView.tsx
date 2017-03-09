import * as React from 'react';
import TileView from './TileView';
import Dashboard from 'model/Dashboard'
import {Tile} from 'model/Tile';
import MetricDB from "../data/MetricDB";

export interface DashboardViewProps {dashboard:Dashboard, metricDB:MetricDB}

const navbar = {
	"background-color": "#373636",
	"width": "100%",
	"height": "40px",
	"padding-left": "21px",
	"padding-top": "9px",
	top: 0
}

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
		 <div style={navbar}>
		 	<img src="/src/logo.svg" width={141}/>
		 </div>
		 <div>
	     	{this.props.dashboard.getTiles().map((tile:Tile) => <TileView tile={tile} key={tile.getID()} metricDB={this.props.metricDB} />)}
	     </div>
	 </div>
    );
  }

}
