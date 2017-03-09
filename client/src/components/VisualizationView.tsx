import * as React from 'react';
import {SeriesChartData} from "visualizations/LineChart";

export interface VisualizationViewProps {data:SeriesChartData}

export class VisualizationView<PropType,OType>  extends React.Component<PropType, OType>  {
	constructor(props:PropType) {
		super(props);		
	}
}
