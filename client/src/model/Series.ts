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

    getMetricsQueryParameters(start:number,end:number): MetricsQueryParameters {
        return {
            id: this.guid,
            metricPath: this.metricPath,
            timeRangeType: "BETWEEN_TIMES",
            "startTime": start,
            "endTime": end,
            rollup: false
        }
    }

    getMetricPath(): string {
        return this.metricPath;
    }
}