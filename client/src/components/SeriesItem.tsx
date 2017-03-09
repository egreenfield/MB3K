import * as React from "react";
import Series from "../model/Series";
import SearchBox from "./SearchBox";
import HistoryItem from "./HistoryItem";
import MetricDB from "../data/MetricDB";
import {Tile} from "../model/Tile";
import RelatedItem from "./RelatedItem";

export interface SeriesItemProps {
    series: Series,
    tile:Tile,
    metricDB: MetricDB,
    addCallback: (metric:String[]) => void,
    deleteCallback: (series:Series) => void
}

var styles = require('./SeriesItem.css');

const floatRight = {
    float: "right"
}

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
        this.handleRelatedClick = this.handleRelatedClick.bind(this);

        this.handleAddFromHistory = this.handleAddFromHistory.bind(this);
        this.handleAddFromRelated = this.handleAddFromRelated.bind(this);
    }

    handleDeleteClick() {
        this.props.deleteCallback(this.props.series);
        event.preventDefault();
    }

    handleRelatedClick() {
        this.setState({mode: "related"});
    }

    handleAddFromRelated(metrics: string[]) {
        this.setState({mode: "display"});
        this.props.addCallback(metrics);
    }

    handleClickDisplay() {
        this.setState({mode: "search"})
    }

    handleCancelSearch() {
        this.setState({mode: this.props.series ? "display" : "search"});
    }

    handleSearchClick() {
        this.setState({mode: "search"});
    }

    handleHistoryClick() {
        this.setState({mode: "history"});
    }

    handleAddFromHistory(metrics: string[]) {
        this.setState({mode: "search"});
        this.props.addCallback(metrics);
    }

    ellipsify(s:string) {
        if (s.length > 47) {
            return "\u2026" + s.substring(s.length - 46)
        } else {
            return s
        }
    }

    render() {
        return (
            <li className="list-group-item" style={{"font-family": "'Inconsolata', monospace"}}>
                <table width="100%">
                    <tr>
                        <td width="*" style={{"padding-right": 10}}>
                            {this.state.mode == "display" && this.props.series ?
                                <span onMouseDown={this.handleClickDisplay}>
                                    <span style={{background: this.props.series.color}}>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                    &nbsp;
                                    <b>{this.props.series.name}</b>:
                                    <span>{this.ellipsify(this.props.series.expression)}</span>
                                </span> :
                                <div>
                                    {this.state.mode == "search" &&
                                        <SearchBox metricDB={this.props.metricDB}
                                                   acceptCallback={this.props.addCallback}
                                                   cancelCallback={this.handleCancelSearch}/>}
                                    {this.state.mode == "history" &&
                                        <table>
                                            {this.props.tile.getHistory().map((m: string) =>
                                                <HistoryItem metricPath={m}
                                                             addCallback={this.handleAddFromHistory}/>)}
                                        </table>}
                                    {this.state.mode == "related" &&
                                    <table>
                                        {this.props.metricDB.findRelated(this.props.series.expression).map((m: string) =>
                                            <RelatedItem metricPath={m}
                                                         addCallback={this.handleAddFromRelated}/>)}
                                    </table>}
                                </div>}
                        </td>
                        <td width="130" style={{"vertical-align": "top"}}>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                {
                                    this.state.mode != "display" && this.state.mode != "related" &&
                                    <button
                                        onClick={this.handleSearchClick}
                                        className={"btn btn-default " + (this.state.mode == "search" ? "active" : "")}>
                                        <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                    </button>
                                }
                                {
                                    this.state.mode != "display" && this.state.mode != "related" &&
                                    <button
                                        onClick={this.handleHistoryClick}
                                        className={"btn btn-default " + (this.state.mode == "history" ? "active" : "")}>
                                        <span className="glyphicon glyphicon-time" aria-hidden="true"></span>
                                    </button>
                                }
                                </div>
                                {
                                    this.props.deleteCallback &&
                                    <button type="button" className="btn btn-default"
                                            onClick={this.handleDeleteClick} style={floatRight}>
                                        <span className="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
                                    </button>
                                }
                                {
                                    (this.state.mode=="display" || this.state.mode=="related")  &&
                                    <button
                                        onClick={this.handleRelatedClick}
                                        className={"btn btn-default " + (this.state.mode == "related" ? "active" : "")}
                                        style={floatRight}>
                                        <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
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
