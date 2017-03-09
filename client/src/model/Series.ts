/**
 * Created by meili.wang on 3/8/17.
 */

import { EventEmitter } from "EventEmitter3";
import Guid from '../utils/Guid';
import {MetricsQueryParameters} from "../data/MetricsDataSource";
import {DataSet} from "../data/DataSet";

export default class Series extends EventEmitter  {
    guid: string;
    name: string;
    expression: string;
    isFormula: boolean;
    color: string;


    constructor(name: string, expression: string, isFormula: boolean, color: string) {
        super();
        this.guid = Guid.newGuid();
        this.name = name;
        this.expression = expression;
        this.isFormula = isFormula;
        this.color = color;
    }

    getMetricsQueryParameters(timespan:number[]): MetricsQueryParameters {
        if (this.isFormula) {
            return null; // Ugly hack!
        } else {
            return {
                id: this.guid,
                metricPath: this.expression,
                timeRangeType: "BETWEEN_TIMES",
                startTime: timespan[0],
                endTime: timespan[1],
                rollup: false
            }
        }
    }

    getFormula(): string {
        if (this.isFormula) {
            return this.expression;
        } else {
            return null; // Ugly hack!
        }
    }

    getExpression(): string {
        return this.expression;
    }
}
