import * as React from 'react';
import {VisualizationView,VisualizationViewProps} from './VisualizationView';
import LineChart from "../visualizations/LineChart";


export interface LineChartViewProps extends VisualizationViewProps {};

export default class LineChartView  extends  VisualizationView<LineChartViewProps, {}>  {

	root:SVGElement;
	chart:LineChart;

	constructor(props:LineChartViewProps) {
		super(props);		
		this.chart = new LineChart();
	}
    render() {
        let data = this.props.data as any;
                
        if(data) {
            return (
                <svg ref={(r) => {this.root = r;}}>
                </svg>
            );			
        }
        else {
            return (
                <div>
                        loading a linechart
                </div>
            );
        }
    }
    componentDidUpdate() {
        this.chart.renderInto(this.root,this.props.data);		
    }
    componentDidMount() {
        this.chart.renderInto(this.root,this.props.data);		
}
}
