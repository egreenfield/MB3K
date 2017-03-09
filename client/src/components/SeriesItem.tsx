import * as React from "react";
import Series from "../model/Series";
import SearchBox from "./SearchBox";
import HistoryItem from "./HistoryItem";
import MetricDB from "../data/MetricDB";
import {Tile} from "../model/Tile";

export interface SeriesItemProps {
    series: Series,
    tile:Tile,
    metricDB: MetricDB,
    addCallback: (metric:String) => void,
    deleteCallback: (series:Series) => void
}

var styles = require('./SeriesItem.css');

export default class SeriesItem extends React.Component<SeriesItemProps, any>  {
    constructor(props:SeriesItemProps) {
        super(props);

        this.state = {
            mode: props.series ? "display" : "search" //, "history"
        };

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleClickDisplay = this.handleClickDisplay.bind(this);
        this.handleCancelSearch = this.handleCancelSearch.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleHistoryClick = this.handleHistoryClick.bind(this);
    }

    handleDeleteClick() {
        this.props.deleteCallback(this.props.series);
        event.preventDefault();
    }

    handleClickDisplay() {
        this.setState({mode: "search"})
    }

    handleCancelSearch() {
        this.setState({mode: "display"});
    }

    handleSearchClick() {
        this.setState({mode: "search"});
    }

    handleHistoryClick() {
        this.setState({mode: "history"});
    }

    render() {
        return (
            <li className="list-group-item">
                <table width="100%">
                    <tr>
                        <td width="*">
                            {this.state.mode == "display" && this.props.series ?
                                <span onMouseDown={this.handleClickDisplay}>
                                    <span style={{background: this.props.series.color}}>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                    &nbsp;
                                    <b>{this.props.series.name}</b>:
                                    {this.props.series.expression}
                                </span> :
                                <div>
                                    {this.state.mode == "search" &&
                                        <SearchBox metricDB={this.props.metricDB}
                                                   acceptCallback={this.props.addCallback}
                                                   cancelCallback={this.handleCancelSearch}/>}
                                    {this.state.mode == "history" &&
                                        <table>
                                            {this.props.tile.getHistory().map((m: string) =>
                                                <HistoryItem metricPath={m} addCallback={this.props.addCallback}/>)}
                                        </table>}
                                </div>}
                        </td>
                        <td width="150">
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                {
                                    this.state.mode != "display" &&
                                    <button
                                        onClick={this.handleSearchClick}
                                        className={"btn btn-default " + (this.state.mode == "search" ? "active" : "")}>
                                        <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                    </button>
                                }
                                {
                                    this.state.mode != "display" &&
                                    <button
                                        onClick={this.handleHistoryClick}
                                        className={"btn btn-default " + (this.state.mode == "history" ? "active" : "")}>
                                        <span className="glyphicon glyphicon-time" aria-hidden="true"></span>
                                    </button>
                                }
                                </div>
                                {
                                    this.props.deleteCallback &&
                                    <button type="button" className="btn btn-default" onClick={this.handleDeleteClick}>
                                        <span className="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
                                    </button>
                                }
                            </div>
                        </td>
                    </tr>
                </table>
            </li>
        );
    }
}
