/**
 * Created by meili.wang on 3/8/17.
 */

import { EventEmitter } from "EventEmitter3";
import Guid from '../utils/Guid';
import {MetricsQueryParameters} from "../data/MetricsDataSource";
import {DataSet} from "../data/DataSet";

export default class Series extends EventEmitter  {
    name: string;
    guid: string;
    metricPath: string;

    constructor(metricPath: string) {
        super();
        this.name = "A";
        this.metricPath = metricPath;
        this.guid = Guid.newGuid();
    }

    getMetricsQueryParameters(): MetricsQueryParameters {
        return {
            id: Guid.newGuid(),
            metricPath: this.metricPath,
            timeRangeType: "BEFORE_NOW",
            durationInMins: 30,
            rollup: false
        }
    }

    getMetricPath(): string {
        return this.metricPath;
    }
}