import * as React from 'react';

import Tile from 'model/Tile';
import SearchBox from "./SearchBox";
import MetricDB from "../data/MetricDB";
import {SeriesResult,MultiSeriesResult} from "../data/DataSet";

import {SeriesChartData} from "visualizations/LineChart";
import Series from "../model/Series";
import SeriesItem from "./SeriesItem";
import HistoryItem from "./HistoryItem";

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

		this.addSeriesToTile = this.addSeriesToTile.bind(this);
		this.deleteSeriesFromTile = this.deleteSeriesFromTile.bind(this);
	}

    buildChartData(results:MultiSeriesResult):SeriesChartData {
        let series = (results && results.series) || [];
        return {
            series: series.map((seriesData:SeriesResult,i:number) => {
                return {
                    values:seriesData.values,
                    color: (seriesColors[i%seriesColors.length]),
                    id: seriesData.id
                }
            })
        }
    }

	addSeriesToTile(metric: string) {
        this.props.tile.addSeries(metric);
    }

    deleteSeriesFromTile(series: Series) {
        this.props.tile.deleteSeries(series);
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
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-12">
                                    <VizType data={this.buildChartData(this.props.tile.getData())}/>
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <ul className="list-group" id="serieses">
                                        {this.props.tile.getSeries().map((s: Series) =>
                                            <SeriesItem
                                                tile={this.props.tile}
                                                series={s}
                                                metricDB={this.props.metricDB}
                                                addCallback={this.addSeriesToTile}
                                                deleteCallback={this.deleteSeriesFromTile}
                                            />)}
                                        <SeriesItem
                                            tile={this.props.tile}
                                            series={null}
                                            metricDB={this.props.metricDB}
                                            addCallback={this.addSeriesToTile}
                                            deleteCallback={null}
                                        />
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
