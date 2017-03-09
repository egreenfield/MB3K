import * as React from 'react';

import Tile from 'model/Tile';
import SearchBox from "./SearchBox";
import MetricDB from "../data/MetricDB";
import {SeriesResult,CompoundSeriesResult} from "../data/DataSet";

import {SeriesChartData} from "visualizations/LineChart";

var styles = require('./TileView.css');

interface TileViewProps {tile:Tile, metricDB:MetricDB}

const seriesColors = [
    "#121326",
    "#330F40",
    "#730037",
    "#CC4021",
    "#FF8730"
];

export default class TileView  extends React.Component<TileViewProps, {}>  {
    constructor(props:TileViewProps) {
		super(props);

		this.handleSearchAccepted = this.handleSearchAccepted.bind(this);
	}
    buildChartData(results:CompoundSeriesResult):SeriesChartData {
        return {
            series: results.series.map((seriesData:SeriesResult,i:number) => {
                return {
                    values:seriesData.values,
                    color: (seriesColors[i%seriesColors.length])
                }
            })
        }
    }

	handleSearchAccepted(metric:string) {
        this.props.tile.addSeries(metric);
    }

    render() {

  	    let VizType = this.props.tile.getVizType();
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
                        <SearchBox metricDB={this.props.metricDB} acceptCallback={this.handleSearchAccepted}/>
                    </div>
                    <div className="span9">
                        <div className="row-fluid">
                            <div className="span12">
                                {
                                    (this.props.tile.getState() == "loaded") &&
                                    <VizType data={this.buildChartData(this.props.tile.getData())}/>
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
