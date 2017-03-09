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


    constructor(name: string, expression: string, isFormula: boolean) {
        super();
        this.guid = Guid.newGuid();
        this.name = name;
        this.expression = expression;
        this.isFormula = isFormula;
    }

    getMetricsQueryParameters(): MetricsQueryParameters {
        if (this.isFormula) {
            return null; // Ugly hack!
        } else {
            return {
                id: this.guid,
                metricPath: this.expression,
                timeRangeType: "BEFORE_NOW",
                durationInMins: 30,
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
