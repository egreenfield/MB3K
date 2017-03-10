///<reference path="../data/FormulaDataSet.ts"/>
import {EventEmitter} from "EventEmitter3";
import LineChartView from "../components/LineChartView"
import Guid from '../utils/Guid';
import {DataManager} from "data/DataManager";
import {DataSet,MultiSeriesResult} from "data/DataSet";
import {MetricsDataSource, MetricsQueryParameters} from "data/MetricsDataSource";
import {FormulaDataSet, FormulaInput, FormulaExpression} from "../data/FormulaDataSet";
import Series from "./Series";
import foo = require("es6-promise");

export class Tile extends EventEmitter {
    dataManager: DataManager;
    id: string;
    series: Series[];
    history: string[];
    query: FormulaDataSet;
    endTime:number;
    duration:number;
    propertyPicker: SeriesPropertyPicker = new SeriesPropertyPicker();

    constructor(DataManager: DataManager) {
        super();
        this.dataManager = DataManager;
        this.id = Guid.newGuid();
        this.series = [];
        this.history = [];
        this.duration = 30/*min*/*60/1*1000/1;

        this.query = new FormulaDataSet({
            inputs: [],
            indexField: "startTimeInMillis",
            formulas: []
        });
    }

    addMetricSeries(metricPath: string) {
        var duplicates = this.series.filter((s) => s.expression == metricPath && !s.isFormula);
        if (duplicates.length == 0) {
            var props = this.propertyPicker.pickRandomSeriesProps();
            var series = new Series(props.name, metricPath, false, props.color);
            this.series.push(series);
            this.refreshData();
        }
        this.addToHistory(metricPath);
    }

    addForumla(formula: string) {
        var duplicates = this.series.filter((s) => s.expression == formula && s.isFormula);
        if (duplicates.length == 0) {
            var props = this.propertyPicker.pickRandomSeriesProps();
            var series = new Series(props.name, formula, true, props.color);
            this.series.push(series);
            this.refreshData();
        }
    }

    deleteSeries(series: Series) {
        this.series = this.series.filter((el) => el != series);
        this.refreshData();
    }

    getTimespan(scale:number = 1):[number,number] {
        let end:number = (this.endTime)? this.endTime:(new Date().getTime());
        let result:[number,number] = [end-this.duration,end];
        let mid = (result[0] + result[1])/2;
        result = [(result[0]-mid)*scale+mid,(result[1]-mid)*scale+mid ];
        return result;
    }

    toMetricFormulaInput(s: Series): FormulaInput {
        let timespan = this.getTimespan(3);
        return {
            name: s.name,
            valueField: "value",
            dataSet: (this.dataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery(s.getMetricsQueryParameters(timespan)),
            color: s.color
        }
    }

    toFormulaInput(s: Series): FormulaExpression {
        return {
            name: s.name,
            valueField: "value",
            expression: s.expression,
            color: s.color
        }
    }

    refreshData() {
        var metrics = this.series.filter((s) => !s.isFormula);
        var formulas = this.series.filter((s) => s.isFormula);

        this.query = new FormulaDataSet({
            inputs: metrics.map((s) => this.toMetricFormulaInput(s)),
            indexField: "startTimeInMillis",
            formulas: formulas.map((s) => this.toFormulaInput(s))
        });

        this.query.on("stateChange", () => this.emit("change"));
        this.load();
    }

    shiftTimeRangeTo(domain:number[],reload:boolean) {
        this.endTime = Math.round(domain[1]);
        this.duration = Math.round((domain[1] - domain[0]));
        if(reload) {
            this.refreshData();
        }
        this.emit("change");
    }

    addToHistory(metricPath: string) {
        for (var i = this.history.length - 1; i >= 0; i--) {
            if (this.history[i] == metricPath) {
                this.history.splice(i);
            }
        }
        this.history.unshift(metricPath);
        while (this.history.length > 20) {
            this.history.shift();
        }
    }

    getState() {
        return this.query.state;
    }

    load() {
        this.query.load();
    }

    getID() {
        return this.id
    }

    getSeries(): Series[] {
        return this.series;
    }

    getHistory(): string[] {
        return this.history;
    }

    // shouldn't be returning a viz class from a model class, should be returning an id that can be resolved to a class.
    getVizType(): any {
        return LineChartView
    }

    getData() {
        return this.query.getData();
    }
}

class SeriesPropertyPicker {
    colors: string[] = [
        "#E34471",
        "#598693",
        "#F2CC49",
        "#EA4D4C",
        "#7AACC1"
    ];
    alphabets: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    nextIndex: number = 0;

    pickRandomSeriesProps(): SeriesProps {
        var ch = this.alphabets.charAt(this.nextIndex % this.alphabets.length);
        var id = Math.floor(this.nextIndex / this.alphabets.length);
        var name = ch + (id == 0 ? "" : id);
        var color = this.colors[this.nextIndex % this.colors.length]

        this.nextIndex++;

        return new SeriesProps(name, color);
    }
}

class SeriesProps {
    name: string;
    color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
}
