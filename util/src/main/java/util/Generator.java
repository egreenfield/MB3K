/*
 * Copyright (c) AppDynamics, Inc., and its affiliates
 * 2017
 * All Rights Reserved
 * THIS IS UNPUBLISHED PROPRIETARY CODE OF APPDYNAMICS, INC.
 * The copyright notice above does not evidence any actual or intended publication of such source code
 */

package util;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;


public class Generator {
    AtomicInteger id = new AtomicInteger(0);
    public static void main(String[]  args) {
        Generator generator =  new Generator();
        try {

            ObjectMapper mapper = new ObjectMapper();
            String json = "";

            List<MetricsData> metricsDataLst = generator.getMetricsData();

            // convert map to JSON string
            json = mapper.writeValueAsString(metricsDataLst);

            System.out.println(json);

            json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(metricsDataLst);

            // pretty print
            System.out.println(json);

        } catch (JsonGenerationException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public List<MetricsData> getMetricsData() {
        List<MetricsData> metricsDataList = new ArrayList<>();

        MetricsData metricsData = new MetricsData();

        metricsData.metricName = "BTM|BTs|BT:143350|Component:2645|Average CPU Used (ms)";
        metricsData.metricId = id.getAndIncrement();
        metricsData.frequency = "ONE_MIN";
        metricsData.dataTimeslices = getDataTimeslices();
        metricsData.latestTimesliceData = 0;
        metricsDataList.add(metricsData);
        return metricsDataList;
    }

    private List<MetricTime> getDataTimeslices() {
        List<MetricTime> metricTimes = new ArrayList<>();
        long currentTimeMillis = System.currentTimeMillis();
        int count = 0;
        while (count <1) {
            MetricTime metricTime = new MetricTime();
            metricTime.startTime = currentTimeMillis +  count * 60 *1000;
            MetricValue metricValue = new MetricValue();
            metricValue.value = getValue();
            metricValue.min = metricValue.value;
            metricValue.max = metricValue.value;
            metricValue.current = metricValue.value;
            metricValue.sum = metricValue.value;
            metricValue.count = metricValue.value;
            metricValue.useRange = true;
            metricValue.groupCount = 600;
            metricValue.standardDeviation = 0.0;
            metricValue.occurance = 1;
            metricTime.metricValue = metricValue;

            count ++;
            metricTimes.add(metricTime);
        }
        return metricTimes;
    }


    private long getValue() {
        return 1;
    }

}
