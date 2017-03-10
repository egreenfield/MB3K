import * as React from "react";

export interface HistoryItemProps { metricPath: string, addCallback: any }

export default class HistoryItem extends React.Component<HistoryItemProps, any>  {

    constructor(props:HistoryItemProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: any) {
        this.props.addCallback([this.props.metricPath]);
        event.preventDefault();
    }

    render() {
        return (<tr className="list-item" onClick={this.handleClick}><td>{this.props.metricPath}</td></tr>)
    }

}