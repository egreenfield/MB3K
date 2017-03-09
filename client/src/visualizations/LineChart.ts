
import * as d3 from "d3";
import {CompoundSeriesResult} from "data/DataSet";


export interface SeriesChartData {
    series: {
        values:any[]
        color:any
    }[]
};

export class LineChart {
    root:SVGElement;
    rootGroup:d3.Selection<d3.BaseType,{},null,undefined>;
    width:Number;
    height:Number;
    line:d3.Line<[Number,Number]>;
    x:any;
    y:any;
    xAxisView:d3.Selection<d3.BaseType,{},null,undefined>;
    yAxisView:d3.Selection<d3.BaseType,{},null,undefined>;

    constructor(svgElement:SVGElement) {
        this.root = svgElement;
        let svg = d3.select(this.root);
        svg.attr("width",600);
        svg.attr("height",400);

        let margin = {top: 20, right: 20, bottom: 30, left: 50};

        this.width = +svg.attr("width") - margin.left - margin.right;
        this.height = +svg.attr("height") - margin.top - margin.bottom;
        this.rootGroup = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = this.x = d3.scaleTime()
            .rangeRound([0, this.width]);

        let y = this.y = d3.scaleLinear()
            .rangeRound([this.height, 0]);

        this.line = d3.line()
        .curve(d3.curveCatmullRom)
            .x((d:any) =>  x(d.startTimeInMillis) )
            .y((d:any) => y(d.value));
       
        this.xAxisView = this.rootGroup.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            // .select(".domain")
            // .remove();

        this.yAxisView = 
            this.rootGroup.append("g");
        this.yAxisView            
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Value");
        
    }

    renderInto(data:SeriesChartData) {

        let svg = d3.select(this.root);
        if(data.series.length == 0) {
            return;
        }

        let x = this.x;
        let y = this.y;



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

        this.yAxisView.call(d3.axisLeft(this.y))
        this.xAxisView.call(d3.axisBottom(x))

        let lineGroups = this.rootGroup.selectAll(".line")
            .data(data.series);

        // console.log("changed lines:",lineGroups.size());
        // console.log("new lines:",lineGroups.enter().size());
        // console.log("dead lines:",lineGroups.exit().size());
        let newLineGroups = lineGroups.enter()
                .append("g")
                .classed("line",true);
        
        newLineGroups
                    .append("path")
                    .attr("fill", "none")
                    .attr("stroke", (d) => {return d.color;})
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .datum((d) => {return d.values})
                    .attr("d", this.line)
                    .transition()
                    .attr("stroke-width", 2.5)

        newLineGroups.selectAll(".dots") 
            .data(d =>  d.values)
                .enter()
                .append("circle")
                    .attr("fill", "#FFFFFF")
                    .attr("stroke", "#000")
                    .attr("stroke-width", 2.5)
                    .attr("cx", d => x(d.startTimeInMillis) )
                    .attr("cy", d => y(d.value) )
                    .transition()
                    .attr("r", 2.5)


        for (let aSeries of data.series) {
        

            // // Add the scatterplot
            // g.selectAll("dot")
            //     .data(aSeries.values)
            // .enter()
            //     .append("circle")
            //         .attr("r", 2.5)
            //         .attr("fill", "#FFFFFF")
            //         .attr("stroke", aSeries.color)
            //         .attr("stroke-width", 2.5)
            //         .attr("cx", function(d) { return x(d.startTimeInMillis); })
            //         .attr("cy", function(d) { return y(d.value); });
            // g.selectAll("dotHitArea")
            //     .data(aSeries.values)
            // .enter()
            //     .append("circle")
            //         .attr("r", 5)
            //         .attr("fill-opacity", "0")
            //         .attr("cx", function(d) { return x(d.startTimeInMillis); })
            //         .attr("cy", function(d) { return y(d.value); })
                
        }
    }
}