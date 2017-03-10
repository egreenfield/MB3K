import * as React from "react";

export interface RelatedItemProps { relatedMetric: string, parentMetric: string, addCallback: any }

export default class RelatedItem extends React.Component<RelatedItemProps, any>  {

    constructor(props:RelatedItemProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: any) {
        this.props.addCallback([this.props.relatedMetric]);
        event.preventDefault();
    }

    contains(els: string[], e: string): boolean {
        for (var i = 0; i < els.length; i++) {
            if (els[i] == e) {
                return true;
            }
        }
        return false;
    }

    render() {
        var parentSplits = this.props.parentMetric.split("|");
        var splits = this.props.relatedMetric.split("|");

        var spans = [];
        for (var i = 0; i < splits.length; i++) {
            if (this.contains(parentSplits, splits[i])) {
                spans.push(<span className="segment-matched">{splits[i]}</span>);
            } else {
                spans.push(<span className="segment-unmatched">{splits[i]}</span>)
            }
            if (i != splits.length - 1) {
                spans.push(<span className="segment-unmatched">|</span>)
            }
        }

        return (<div className="list-item" onClick={this.handleClick}>{spans}</div>)
    }

}