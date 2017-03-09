import * as React from 'react';
import {VisualizationView,VisualizationViewProps} from './VisualizationView';
import {LineChart} from "../visualizations/LineChart";


export default class LineChartView  extends  VisualizationView<VisualizationViewProps, {}>  {

	root:SVGElement;
	chart:LineChart;

	constructor(props:VisualizationViewProps) {
		super(props);		
		this.chart = new LineChart();
	}
    render() {
        return (
            <svg ref={(r) => {this.root = r;}}>
            </svg>
        );			
    }
    componentDidUpdate() {
        this.chart.renderInto(this.root,this.props.data);		
    }
    componentDidMount() {
        this.chart.renderInto(this.root,this.props.data);		
}
}
