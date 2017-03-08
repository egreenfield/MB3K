import * as React from "react";
import MetricDB from "../data/MetricDB";

export interface SearchBoxProps { metricDB:MetricDB }

export default class SearchBox extends React.Component<SearchBoxProps, any>  {

    constructor(props:SearchBoxProps) {
		super(props);

		this.state = {
		    query: ""
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
	}

	handleQueryChange(event:any) {
        this.setState({query: event.target.value});
    }

  render() {
  	return (
     <div>
         <input type="text" value={this.state.query} onChange={this.handleQueryChange}/>

         {this.state.query != "" &&
             this.props.metricDB.find(this.state.query).map((metric:String) =>
             <div>{metric}</div>
         )}
     </div>
      );
  }

}
