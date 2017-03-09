///<reference path="../data/FormulaDataSet.ts"/>
import {EventEmitter} from "EventEmitter3";
import LineChartView from "../components/LineChartView"
import Guid from '../utils/Guid';
import {DataManager} from "data/DataManager";
import {DataSet} from "data/DataSet";
import {MetricsDataSource, MetricsQueryParameters} from "data/MetricsDataSource";
import {CompoundDataSource} from "data/CompoundDataSource";
import {FormulaDataSet, FormulaInput} from "../data/FormulaDataSet";
import Series from "./Series";
import foo = require("es6-promise");

export default class Tile extends EventEmitter {
    dataManager: DataManager;
    id: string;
    series: Series[];
    history: Series[];
    query: DataSet;

    constructor(DataManager: DataManager) {
        super();
        this.dataManager = DataManager;
        this.id = Guid.newGuid();
        this.series = [];
        this.history = [];

        this.addSeries('Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)');
        // this.addSeries('Overall Application Performance|Calls per Minute');
    }

    addSeries(metricPath: string) {
        var series = new Series(metricPath);
        this.series.push(series);
        this.addToHistory(series);
        this.refreshData();
    }

    deleteSeries(series: Series) {
        this.series.filter((el) => el == series);
        this.refreshData();
    }

    toFormulaInput(s: Series): FormulaInput {
        return {
            name: s.name,
            valueField: "value",
            dataSet: (this.dataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery(s.getMetricsQueryParameters())
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

    addToHistory(series: Series) {
        this.history.push(series);
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

    getHistory(): string[] {
        return this.history.map((s) => s.getMetricPath());
    }

    // shouldn't be returning a viz class from a model class, should be returning an id that can be resolved to a class.
    getVizType(): any {
        return LineChartView
    }

    getData() {
        return this.query.getData();
    }
}