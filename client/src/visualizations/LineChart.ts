
import * as d3 from "d3";



export default class LineChart {
    constructor() {

    }
    renderInto(svgElement:SVGElement,data:any) {
        let svg = d3.select(svgElement);
        svg.attr("width",600);
        svg.attr("height",400);

        console.log("RENDERING");
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
            .x(function(d:any) { return x(d.startTimeInMillis); })
            .y(function(d:any) { return y(d.value); });


    
        x.domain(d3.extent(data.results,(d:any) => { 
                return d.startTimeInMillis;
            }) as any
         );
    
        y.domain(d3.extent(data.results, (d:any) => { 
                return d.value; 
            }) as any
        );

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


        g.append("path")
            .datum(data.results)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    }
}