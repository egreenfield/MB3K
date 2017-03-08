import * as React from 'react';

import Tile from 'model/Tile';
import SearchBox from "./SearchBox";
import MetricDB from "../data/MetricDB";

var styles = require('./TileView.css');

interface TileViewProps {tile:Tile, metricDB:MetricDB}

export default class TileView  extends React.Component<TileViewProps, {}>  {
	constructor(props:TileViewProps) {
		super(props);		
	}
  render() {
  	let VizType = this.props.tile.getVizType();
    console.log("styles is",styles);
    return (


     <div  id="aTile" >
         <SearchBox metricDB={this.props.metricDB}/>
        {
        	(this.props.tile.getState()=="loaded") &&
        		<VizType data={this.props.tile.getData()} />        	
        }
      </div>
      );
  }

}
