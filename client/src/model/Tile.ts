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
    namer: SeriesNamer = new SeriesNamer();

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


        this.addMetricSeries('Business Transaction Performance|Business Transactions|LoanProcessor-Services|/processor/CreditCheck|Average Response Time (ms)');
    }

    addMetricSeries(metricPath: string) {
        var duplicates = this.series.filter((s) => s.expression == metricPath && !s.isFormula);
        if (duplicates.length == 0) {
            var series = new Series(this.namer.getNextName(), metricPath, false);
            this.series.push(series);
            this.refreshData();
        }
        this.addToHistory(metricPath);
    }

    addForumla(formula: string) {
        var duplicates = this.series.filter((s) => s.expression == formula && s.isFormula);
        if (duplicates.length == 0) {
            var series = new Series(this.namer.getNextName(), formula, true);
            this.series.push(series);
            this.refreshData();
        }
    }

    deleteSeries(series: Series) {
        this.series = this.series.filter((el) => el != series);
        this.refreshData();
    }

    getTimespan():[number,number] {
        let end:number = (this.endTime)? this.endTime:(new Date().getTime());
        return [end-this.duration,end];
    }

        toMetricFormulaInput(s: Series): FormulaInput {
        let timespan = this.getTimespan();
        return {
            name: s.name,
            valueField: "value",
            dataSet: (this.dataManager.sourceFromID("ADC-metrics") as MetricsDataSource).newQuery(s.getMetricsQueryParameters(timespan))
        }
    }

    toFormulaInput(s: Series): FormulaExpression {
        return {
            name: s.name,
            valueField: "value",
            expression: s.expression
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

class SeriesNamer {
    alphabets: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    nextIndex: number = 0;

    getNextName(): string {
        var ch = this.alphabets.charAt(this.nextIndex % this.alphabets.length);
        var id = Math.floor(this.nextIndex / this.alphabets.length);

        this.nextIndex++;

        return ch + (id == 0 ? "" : id);
    }

}
