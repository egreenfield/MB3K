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
            <div>
            <div className="navbar navbar-inverse navbar-fixed-top">
                <div className="navbar-inner">
                    <div className="container-fluid">

                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row-fluid">
                    <div className="span3">
                        <SearchBox metricDB={this.props.metricDB}/>
                    </div>
                    <div className="span9">
                        <div className="row-fluid">
                            <div className="span12">
                                {
                                    (this.props.tile.getState() == "loaded") &&
                                    <VizType data={this.props.tile.getData()}/>
                                }
                            </div>
                        </div>
                        <div className="row-fluid">
                            <div className="span12">
                                Controls
                            </div>
                        </div>
                    </div>
                </div>

                <hr></hr>

                <footer>
                    <p>Adam, Binil, Ely, Meili</p>
                </footer>
            </div>
        </div>
        );
    }
}
