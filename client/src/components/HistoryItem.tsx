import * as React from "react";

export interface HistoryItemProps { metricPath: string }

export default class HistoryItem extends React.Component<HistoryItemProps, any>  {

    constructor(props:HistoryItemProps) {
        super(props);
    }

    render() {
        return (<tr><td>{this.props.metricPath}</td></tr>)
    }

}