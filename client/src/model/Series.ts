/**
 * Created by meili.wang on 3/8/17.
 */

import { EventEmitter } from "EventEmitter3";
import Guid from '../utils/Guid';
import {MetricsQueryParameters} from "../data/MetricsDataSource";

export default class Series extends EventEmitter  {
    source: string;
    guid: string;
    metricPath: string;
    subQuery: any; // TODO

    constructor(source: string, metricPath: string) {
        super();
        this.source = source;
        this.metricPath = metricPath;
        this.guid = Guid.newGuid();
        this.subQuery = {
            source: this.source,
            parameters:{
                id: this.guid,
                metricPath: this.metricPath,
                timeRangeType: "BEFORE_NOW",
                durationInMins: 30,
                rollup: false
            } as MetricsQueryParameters
        }
    }
}