import * as React from "react";
import MetricDB from "../data/MetricDB";
import DOMElement = React.DOMElement;

export interface SearchBoxProps { metricDB:MetricDB, acceptCallback:any, cancelCallback:any }

var styles = require('./SearchBox.css');

const inputStyle = {
    width: "100%",
    padding: "5px"
}

export default class SearchBox extends React.Component<SearchBoxProps, any>  {

    private input: HTMLInputElement;

    constructor(props:SearchBoxProps) {
		super(props);

		this.state = this.getInitState();

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
	}

	getInitState(): any {
        return {
            query: "",
            lastQueryResult: [],
            isInputFocused: true,
            firstSelectedItem: -1,
            lastSelectedItem: -1,

            popupStyle: {
                top: 0,
                left: 0,
                position: 'relative',
                width: 900
            }
        };
    }

	handleQueryChange(event:any) {
        let newQuery = event.target.value;
        this.updateQuery(newQuery);
    }

    updateQuery(newQuery: any) {
        let newQueryResult = this.props.metricDB.find(newQuery);
        let newSelectedItem = this.state.lastQueryResult.length > 0 ? 0 : -1;

        this.setState({
            query: newQuery,
            lastQueryResult: newQueryResult,
            firstSelectedItem: newSelectedItem,
            lastSelectedItem: newSelectedItem
        });
    }

    isSelected(i:number) {
        let first = this.state.firstSelectedItem;
        let last = this.state.lastSelectedItem;
        if (first <= last) {
            return first <= i && i <= last;
        } else {
            return last <= i && i <= first;
        }
    }

    getSelectedMetrics() {
        let first = this.state.firstSelectedItem;
        let last = this.state.lastSelectedItem;

        let low = first <= last ? first : last;
        let high = last >= first ? last : first;

        return this.state.lastQueryResult.slice(low, high + 1).map((row:any) => row.metric)
    }

    componentDidMount() {
        this.input.focus();
    }

    componentWillReceiveProps(nextProps: any) {
        var rect = this.input.getBoundingClientRect();
        this.state = this.getInitState();
        this.state.popupStyle = {
            top: rect.bottom,
            left: rect.left,
            position: 'fixed',
            width: 900,
            overflow: 'visible'
        };
        this.setState(this.state);
    }

    handleInputKeyDown(event:any) {

        let enter:Boolean = event.keyCode == 13;
        let esc:Boolean = event.keyCode == 27;
        if (enter || esc) {
            event.preventDefault();

            if (enter) {
                if (this.state.firstSelectedItem != -1) {
                    this.props.acceptCallback(this.getSelectedMetrics());
                } else if (this.state.query.charAt(0) == "=") {
                    this.props.acceptCallback([this.state.query]);
                }
            }

            if (esc) {
                this.props.cancelCallback();
            }

            this.updateQuery("");
            return;
        }

        let down:boolean = event.keyCode == 40;
        let up:boolean = event.keyCode == 38;

        if (up || down && this.state.lastQueryResult != null) {
            event.preventDefault();

            // "Last" is the cursor that the arrow keys move
            // For single-select, first just rides along with last
            // For multi-select, first stays the same for the duration of the multi-selection
            var newLast = Math.max(
                0,
                Math.min(
                    this.state.lastQueryResult.length - 1,
                    this.state.lastSelectedItem + (down ? 1 : -1)))

            var newFirst = event.shiftKey ? this.state.firstSelectedItem : newLast;

            this.setState({firstSelectedItem: newFirst, lastSelectedItem: newLast});
        }
    }

    render() {
        var listItems:any[] = [];
        var rows:String[] = this.state.lastQueryResult;
        for (var i = 0; i < Math.min(15, rows.length); i++) {
            var row:any = rows[i];
            listItems.push(
                <div className={this.isSelected(i) ? "list-item-selected" : "list-item"} style={{'padding-left': '10px'}}>{
                    row.segments.map((seg:any) =>
                        <span className={seg.match ? "segment-matched" : "segment-unmatched"}>{seg.text}</span>
                    )
                }
                </div>
            )
        }

        return (
         <div style={{width: '420px'}}>
             <input type="text" value={this.state.query}
                    style={inputStyle}
                    ref={(input) => { this.input = input; }}
                    onChange={this.handleQueryChange}
                    onKeyDown={this.handleInputKeyDown}/>
             <div style={this.state.popupStyle}>
             {listItems}
             </div>
         </div>
          );
    }
}
