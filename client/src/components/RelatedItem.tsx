import * as React from "react";

export interface RelatedItemProps { metricPath: string, addCallback: any }

export default class RelatedItem extends React.Component<RelatedItemProps, any>  {

    constructor(props:RelatedItemProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: any) {
        this.props.addCallback([this.props.metricPath]);
        event.preventDefault();
    }

    render() {
        return (<div className="list-item" onClick={this.handleClick}>{this.props.metricPath}</div>)
    }

}