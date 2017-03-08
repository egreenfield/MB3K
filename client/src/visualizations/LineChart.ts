
import * as d3 from "d3";
import {CompoundSeriesResult} from "data/DataQuery";


export default class LineChart {
    constructor() {

    }
    renderInto(svgElement:SVGElement,data:CompoundSeriesResult) {
        let svg = d3.select(svgElement);
        svg.attr("width",600);
        svg.attr("height",400);

        
        if(data.series.length == 0) {
            return;
        }

        let margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let parseTime = d3.timeParse("%d-%b-%y");

        let x = d3.scaleTime()
            .rangeRound([0, width]);

        let y = d3.scaleLinear()
            .rangeRound([height, 0]);

        let line = d3.line()
        .curve(d3.curveBasis)
            .x((d:any) => { return x(d.startTimeInMillis); })
            .y((d:any) => { return y(d.value); });

        x.domain(d3.extent(data.series[0].values,(d:any) => { 
                return d.startTimeInMillis;
            }) as any
        );
        y.domain([
            d3.min(data.series, (series) => { 
                return d3.min(series.values, (v) => { 
                    return v.value; 
                }); 
            }),
            d3.max(data.series, (series) => { 
                return d3.max(series.values, (v) => { 
                    return v.value; 
                }); 
            })
        ]);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            // .select(".domain")
            // .remove();

        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Value");


        for (let aSeries of data.series) {
        
            g.append("path")
                .datum(aSeries.values)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        }
    }
}