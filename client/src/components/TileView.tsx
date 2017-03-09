import * as React from 'react';

import Tile from 'model/Tile';
import SearchBox from "./SearchBox";
import MetricDB from "../data/MetricDB";
import {SeriesResult,CompoundSeriesResult} from "../data/DataSet";

import {SeriesChartData} from "visualizations/LineChart";
import Series from "../model/Series";
import SeriesItem from "./SeriesItem";

var styles = require('./TileView.css');

interface TileViewProps {tile:Tile, metricDB:MetricDB}

const seriesColors = [
    "#E34471",
    "#598693",
    "#7AACC1",
    "#F2CC49",
    "#EA4D4C"
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

                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <SearchBox metricDB={this.props.metricDB} acceptCallback={this.handleSearchAccepted}/>
                        </div>
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-12">
                                    {
                                        (this.props.tile.getState() == "loaded") &&
                                        <VizType data={this.buildChartData(this.props.tile.getData())}/>
                                    }
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <ul className="list-group" id="serieses">
                                        {this.props.tile.getSeries().map((s: Series) => <SeriesItem series={s}/>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr></hr>

                    <footer>
                    </footer>
                </div>
            </div>
        );
    }
}
