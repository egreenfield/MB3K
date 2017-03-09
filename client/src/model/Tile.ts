///<reference path="../data/FormulaDataSet.ts"/>
import {EventEmitter} from "EventEmitter3";
import LineChartView from "../components/LineChartView"
import Guid from '../utils/Guid';
import {DataManager} from "data/DataManager";
import {DataSet,MultiSeriesResult} from "data/DataSet";
import {MetricsDataSource, MetricsQueryParameters} from "data/MetricsDataSource";
import {FormulaDataSet, FormulaInput} from "../data/FormulaDataSet";
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


        this.addSeries('Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)');
        // this.addSeries('Overall Application Performance|Calls per Minute');
    }

    addSeries(metricPath: string) {
        var dups = this.series.filter((s) => s.metricPath == metricPath);
        if (dups.length == 0) {
            var series = new Series(metricPath);
            this.series.push(series);
            this.refreshData();
        }
        this.addToHistory(metricPath);
    }

    deleteSeries(series: Series) {
        this.series = this.series.filter((el) => el != series);
        this.refreshData();
    }
    getDuration():[number,number] {
        let end:number = (this.endTime)? this.endTime:(new Date().getTime());
        return [end-this.duration,end];
    }

    toFormulaInput(s: Series): FormulaInput {
        let duration = this.getDuration();
        return {
            name: s.name,
            valueField: "value",
            dataSet: (this.dataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery(s.getMetricsQueryParameters(duration[0],duration[1]))
        }
    }

    refreshData() {
        this.query = new FormulaDataSet({
            inputs: this.series.map((s) => this.toFormulaInput(s)),
            indexField: "startTimeInMillis",
            formulas: []
        });

        this.query.on("stateChange", () => this.emit("change"));
        this.load();
    }

    shiftTimeRangeTo(domain:number[]) {
        this.endTime = domain[1];
        this.duration = (domain[1] - domain[0]);
        this.refreshData();
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