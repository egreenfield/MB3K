import * as React from 'react';

export interface VisualizationViewProps {data:any}

export class VisualizationView<PropType,OType>  extends React.Component<PropType, OType>  {
	constructor(props:PropType) {
		super(props);		
	}
}
