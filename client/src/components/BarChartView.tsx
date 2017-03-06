import * as React from 'react';
import {VisualizationView,VisualizationViewProps} from './VisualizationView';
export interface BarChartViewProps extends VisualizationViewProps {};
import Vega from "react-vega";
import DefaultSpec from "../tempData/barChartSpec";


export default class BarChartView  extends  VisualizationView<BarChartViewProps, {}>  {

	root:HTMLElement;
//	chart:BarChart;

	constructor(props:BarChartViewProps) {
		super(props);		
//		this.chart = new BarChart();

	}
  render() {
		let data = this.props.data as any;

		if(data) {
			let spec = DefaultSpec;
			let barData = {
				table: [
					[ 1,  28],[ 2,   55],
					[ 3,  43],[ 4,   91],
					[ 5,  81],[ 6,   53]
				]
			};
			return (
				<Vega spec={spec} data={{table: data.results}} />
				/*<div ref={(r) => {this.root = r;}}>
						this is a BarChart
				</div>*/
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
	// componentDidUpdate() {
	// 	this.chart.renderInto(this.root,this.props.data);		
	// }
	// componentDidMount() {
	// 	this.chart.renderInto(this.root,this.props.data);		
	// }
}
