import * as React from 'react';
import {VizzieView,VizzieViewProps} from './VizzieView';

export interface BarChartViewProps extends VizzieViewProps {data:Object};

export default class BarChartView  extends  React.Component<BarChartViewProps, {}>  {
	constructor(props:BarChartViewProps) {
		super(props);		
	}
  render() {
    return (
	    <div >
	        this is a BarChart
	    </div>
    );
  }

}
