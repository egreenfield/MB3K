import * as React from "react";

export interface RelatedItemProps { relatedMetric: string, parentMetric: string, addCallback: any, addAllCallback: any }

export default class RelatedItem extends React.Component<RelatedItemProps, any> {

    constructor(props: RelatedItemProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: any) {
        if (event.shiftKey) {
            this.props.addAllCallback();
        } else {
            this.props.addCallback([this.props.relatedMetric]);
        }
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
        var spans = [];
        var index = this.props.relatedMetric.indexOf('Individual Nodes');
        if (index < 0) {
            spans.push(<span className="relation-name">Similar Names:&nbsp;</span>);
            index = this.props.relatedMetric.indexOf("|") ;
        }else {
            spans.push(<span className="relation-name">Sibling Nodes:&nbsp;</span>);
            index = index +'Individual Nodes'.length;
        }

        var parentSplits = this.props.parentMetric.substr(index+1).split("|");
        var splits = this.props.relatedMetric.substr(index+1).split("|");


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
