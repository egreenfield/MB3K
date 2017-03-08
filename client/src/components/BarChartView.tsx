import * as React from 'react';
import {VisualizationView,VisualizationViewProps} from './VisualizationView';
export interface BarChartViewProps extends VisualizationViewProps {};
import DefaultSpec from "../tempData/barChartSpec";
import BarChart from "../visualizations/BarChart";



export default class BarChartView  extends  VisualizationView<BarChartViewProps, {}>  {

	root:SVGElement;
	chart:BarChart;

	constructor(props:BarChartViewProps) {
		super(props);		
		this.chart = new BarChart();
	}
  render() {
		let data = this.props.data as any;
				
		if(data) {
			let spec = DefaultSpec;
			return (
				<svg ref={(r) => {this.root = r;}}>
				</svg>
			);			
		}
		else {
			return (
				<div>
						loading a barchart
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
