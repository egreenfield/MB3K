import * as React from 'react';

import Tile from 'model/Tile';

//import styles from "./TileView.css";

interface TileViewProps {tile:Tile}

export default class TileView  extends React.Component<TileViewProps, {}>  {
	constructor(props:TileViewProps) {
		super(props);		
	}
  render() {
  	let VizType = this.props.tile.getVizType();
    return (
     <div className="Tile" >
        {this.props.tile.getState()}
        {
        	(this.props.tile.getState()=="loaded") &&
        		<VizType data={this.props.tile.getData()} />        	
        }
      </div>
      );
  }

}
