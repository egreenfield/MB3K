import * as React from 'react';

import Tile from 'model/Tile';

var styles = require('./TileView.css');

interface TileViewProps {tile:Tile}

export default class TileView  extends React.Component<TileViewProps, {}>  {
	constructor(props:TileViewProps) {
		super(props);		
	}
  render() {
  	let VizType = this.props.tile.getVizType();
    console.log("styles is",styles);
    return (
     <div  id="aTile" >
        {
        	(this.props.tile.getState()=="loaded") &&
        		<VizType data={this.props.tile.getData()} />        	
        }
      </div>
      );
  }

}
