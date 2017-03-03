import React from 'react';

import styles from "./TileView.css";

export default class TileView  extends React.Component { 
	constructor(props) {
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
