import * as React from 'react';
import {VisualizationView,VisualizationViewProps} from './VisualizationView';
import {LineChart} from "../visualizations/LineChart";

export default class LineChartView  extends  VisualizationView<VisualizationViewProps, {}>  {

	root:SVGElement;
	chart:LineChart;

	constructor(props:VisualizationViewProps) {
		super(props);		
	}
    render() {
        return (
            <svg ref={(r) => {this.root = r;}} width="800" height="600">
            </svg>
        );			
    }
    componentDidUpdate() {
        this.chart.renderInto(this.props.data);		
    }
    componentDidMount() {
        if(this.chart == null) {
            this.chart = new LineChart(this.root);
            this.chart.setPanToCallback(this.props.panTo);
        }
        this.chart.renderInto(this.props.data);		
}
}
