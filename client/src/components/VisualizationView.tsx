import * as React from 'react';
import {CompoundSeriesResult} from 'data/DataSet';
export interface VisualizationViewProps {data:CompoundSeriesResult}

export class VisualizationView<PropType,OType>  extends React.Component<PropType, OType>  {
	constructor(props:PropType) {
		super(props);		
	}
}
