import React from 'react';

import styles from "./TileView.css";
console.log("styles are",styles);

export default class TileView  extends React.Component { 
	constructor(props) {
		super(props);		
	}
  render() {
    return (
     <div className="Tile" >
        this is a tile
      </div>)
    ;
  }

}
