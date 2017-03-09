import * as React from 'react';

import {Tile} from 'model/Tile';
import SearchBox from "./SearchBox";
import MetricDB from "../data/MetricDB";
import {SeriesResult,MultiSeriesResult} from "../data/DataSet";

import {SeriesChartData} from "visualizations/LineChart";
import Series from "../model/Series";
import SeriesItem from "./SeriesItem";
import HistoryItem from "./HistoryItem";

var styles = require('./TileView.css');

interface TileViewProps {tile:Tile, metricDB:MetricDB}

const cell = {
    "vertical-align": "top",
    "padding": "21px"
}

export default class TileView  extends React.Component<TileViewProps, {}>  {
    constructor(props:TileViewProps) {
		super(props);

		this.addSeriesToTile = this.addSeriesToTile.bind(this);
		this.deleteSeriesFromTile = this.deleteSeriesFromTile.bind(this);
	}

    buildChartData():SeriesChartData {
        let tile = this.props.tile;
        let results = tile.getData();
        let domain = tile.getDuration();
        let series = (results && results.series) || [];
        return {
            series: series.map((seriesData:SeriesResult,i:number) => {
                return {
                    values:seriesData.values,
                    color: seriesData.color,
                    id: seriesData.id
                }
            }),
            xStart: domain[0],
            xEnd: domain[1]
        }
    }

	addSeriesToTile(metric: string) {
        if (metric.charAt(0) == "=") {
            this.props.tile.addForumla(metric.substr(1));
        } else {
            this.props.tile.addMetricSeries(metric);
        }
    }

    deleteSeriesFromTile(series: Series) {
        this.props.tile.deleteSeries(series);
    }

    render() {
  	    let VizType = this.props.tile.getVizType();

        return (
            <table>
                <tr>
                    <td width={600} style={cell}>
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
                    </td>
                    <td width="*" style={cell}>
                        <VizType data={this.buildChartData()} panTo={(newDomain:number[]) => {this.props.tile.shiftTimeRangeTo(newDomain) }} />
                    </td>
                </tr>
            </table>
        );
    }
}
