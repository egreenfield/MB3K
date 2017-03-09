import * as React from "react";
import Series from "../model/Series";

export interface SeriesItemProps { series: Series, deleteCallback: (series:Series) => void}

var styles = require('./SeriesItem.css');

export default class SeriesItem extends React.Component<SeriesItemProps, any>  {
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
                {this.props.series.getMetricPath()}
                <button type="button" className="btn btn-danger btn-xs delete" onClick={this.handleDeleteClick}>
                    <span className="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
                </button>
            </li>
        );
    }
}
