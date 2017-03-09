import * as React from "react";
import Series from "../model/Series";

export interface SeriesItemProps { series: Series }

var styles = require('./SeriesItem.css');

export default class SeriesItem extends React.Component<SeriesItemProps, any>  {
    constructor(props:SeriesItemProps) {
        super(props);
    }

    render() {
        return (
            <li className="list-group-item">
                {this.props.series.getMetricPath()}
                <button type="button" className="btn btn-danger btn-xs delete">
                    <span className="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
                </button>
            </li>
        );
    }
}
