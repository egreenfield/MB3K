import * as React from "react";
import Series from "../model/Series";
import SearchBox from "./SearchBox";
import HistoryItem from "./HistoryItem";
import MetricDB from "../data/MetricDB";
import Tile from "../model/Tile";

export interface SeriesItemProps {
    series: Series,
    tile:Tile,
    metricDB: MetricDB,
    addCallback: (metric:String) => void,
    deleteCallback: (series:Series) => void
}

var styles = require('./SeriesItem.css');

export default class SeriesItem extends React.Component<SeriesItemProps, {}>  {
    constructor(props:SeriesItemProps) {
        super(props);

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleDeleteClick() {
        console.log("deleting " + this.props.series.getMetricPath());
        this.props.deleteCallback(this.props.series);
        event.preventDefault();
    }

    render() {
        return (
            <li className="list-group-item">
                {
                    this.props.series && this.props.series.getMetricPath()
                }
                {
                    this.props.series && this.props.deleteCallback &&
                        <button type="button" className="btn btn-danger btn-xs delete" onClick={this.handleDeleteClick}>
                            <span className="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
                        </button>
                }
                <div className="row">
                    <SearchBox metricDB={this.props.metricDB} acceptCallback={this.props.addCallback}/>
                </div>
                <div className="row">
                    History
                </div>
                <div className="row">
                    <table>
                        {this.props.tile.getHistory().map((m: string) =>
                            <HistoryItem metricPath={m} addCallback={this.props.addCallback}/>)}
                    </table>
                </div>
            </li>
        );
    }
}
