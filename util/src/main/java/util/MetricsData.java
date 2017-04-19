/*
 * Copyright (c) AppDynamics, Inc., and its affiliates
 * 2017
 * All Rights Reserved
 * THIS IS UNPUBLISHED PROPRIETARY CODE OF APPDYNAMICS, INC.
 * The copyright notice above does not evidence any actual or intended publication of such source code
 */

package util;

import java.util.List;

public class MetricsData {
    public long getMetricId() {
        return metricId;
    }

    public void setMetricId(long metricId) {
        this.metricId = metricId;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public List<MetricTime> getDataTimeslices() {
        return dataTimeslices;
    }

    public void setDataTimeslices(List<MetricTime> dataTimeslices) {
        this.dataTimeslices = dataTimeslices;
    }

    public int getLatestTimesliceData() {
        return latestTimesliceData;
    }

    public void setLatestTimesliceData(int latestTimesliceData) {
        this.latestTimesliceData = latestTimesliceData;
    }

    long metricId;
    public String metricName;
    String frequency;
    List<MetricTime> dataTimeslices;
    int latestTimesliceData;
}

class MetricTime {
    long startTime;
    MetricValue metricValue;

    public MetricValue getMetricValue() {
        return metricValue;
    }

    public void setMetricValue(MetricValue metricValue) {
        this.metricValue = metricValue;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

}
class MetricValue {
    public void setValue(long value) {
        this.value = value;
    }

    public long getValue() {
        return value;
    }

    public long getMin() {
        return min;
    }

    public long getMax() {
        return max;
    }

    public long getCurrent() {
        return current;
    }

    public long getSum() {
        return sum;
    }

    public long getCount() {
        return count;
    }

    public boolean isUseRange() {
        return useRange;
    }

    public long getGroupCount() {
        return groupCount;
    }

    public double getStandardDeviation() {
        return standardDeviation;
    }

    public long getOccurance() {
        return occurance;
    }

    public void setMin(long min) {
        this.min = min;
    }

    public void setMax(long max) {
        this.max = max;
    }

    public void setCurrent(long current) {
        this.current = current;
    }

    public void setSum(long sum) {
        this.sum = sum;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public void setUseRange(boolean useRange) {
        this.useRange = useRange;
    }

    public void setGroupCount(long groupCount) {
        this.groupCount = groupCount;
    }

    public void setStandardDeviation(long standardDeviation) {
        this.standardDeviation = standardDeviation;
    }

    public void setOccurance(long occurance) {
        this.occurance = occurance;
    }

    long value;
    long min;
    long max;
    long current;
    long sum;
    long count;
    boolean useRange;
    long groupCount;
    double standardDeviation;
    long occurance;
}
