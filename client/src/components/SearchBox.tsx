import * as React from "react";
import MetricDB from "../data/MetricDB";

export interface SearchBoxProps { metricDB:MetricDB }

var styles = require('./SearchBox.css');

export default class SearchBox extends React.Component<SearchBoxProps, any>  {

    constructor(props:SearchBoxProps) {
		super(props);

		this.state = {
		    query: "",
            lastQueryResult: [],
            isInputFocused: true,
            selectedItem: -1
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
	}

	handleQueryChange(event:any) {
        let newQuery = event.target.value;
        this.updateQuery(newQuery);
    }

    private updateQuery(newQuery: any) {
        let newQueryResult = this.props.metricDB.find(newQuery);
        let newSelectedItem = this.state.lastQueryResult.length > 0 ? 0 : -1;

        this.setState({query: newQuery, lastQueryResult: newQueryResult, selectedItem: newSelectedItem});
    }

    handleInputKeyDown(event:any) {

        let esc:Boolean = event.keyCode == 27;
        if (esc) {
            event.preventDefault();
            this.updateQuery("");
            return;
        }

        let down:boolean = event.keyCode == 40;
        let up:boolean = event.keyCode == 38;

        if (up || down) {
            event.preventDefault();

            if (this.state.lastQueryResult != null) {
                this.setState({selectedItem:
                    Math.max(
                        0,
                        Math.min(
                            this.state.lastQueryResult.length - 1,
                            this.state.selectedItem + (down ? 1 : -1)))
                });
            }
        }
    }

  render() {

        var listItems:any[] = [];
        var rows:String[] = this.state.lastQueryResult;
        for (var i = 0; i < Math.min(15, rows.length); i++) {
            var row:any = rows[i];
            listItems.push(
                <div className={this.state.selectedItem == i ? "list-item-selected" : "list-item"}>{
                    row.segments.map((seg:any) =>
                        <span className={seg.match ? "segment-matched" : "segment-unmatched"}>{seg.text}</span>
                    )
                }
                </div>
            )
        }

  	return (
     <div>
         <input type="text" value={this.state.query}
                onChange={this.handleQueryChange}
                onKeyDown={this.handleInputKeyDown}/>
         {listItems}
     </div>
      );
  }

}