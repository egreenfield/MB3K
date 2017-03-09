
import * as d3 from "d3";
import {MultiSeriesResult} from "data/DataSet";


export interface SeriesChartData {
    series: {
        values:any[];
        color:any;
        id:string;
    }[],
    xStart?:any;
    xEnd?:any;
};

export class LineChart {
    root:SVGElement;
    rootGroup:d3.Selection<d3.BaseType,{},null,undefined>;
    width:number;
    height:number;
    line:d3.Line<[Number,Number]>;
    x:any;
    y:any;
    xAxisView:d3.Selection<d3.BaseType,{},null,undefined>;
    yAxisView:d3.Selection<d3.BaseType,{},null,undefined>;
    yAxisGenerator:d3.Axis<number | { valueOf(): number; }>;
    xDomain:[number,number];
    animateChanges:boolean = true;

    panToCallback:(delta:number[],reload:boolean) => void;

    constructor(svgElement:SVGElement) {
        this.root = svgElement;
        let svg = d3.select(this.root);
        svg.attr("width",600);
        svg.attr("height",400);
        
        this.root.onwheel = () => false;
        let margin = {top: 20, right: 20, bottom: 30, left: 50};

        this.width = +svg.attr("width") - margin.left - margin.right;
        this.height = +svg.attr("height") - margin.top - margin.bottom;


        //clippath
         svg.append("defs").append("rect").
            attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "#FFAAAA")
            .attr("id","clipper")

        this.rootGroup = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("clip-path","url('#clipper')")
        
        let baseDomain:number[];
        let zoom = d3.zoom()
//            .scaleExtent([0, 10])
            .on("start", () => {
                baseDomain = this.xDomain.concat();
                return false  
            })
            .on("end",() => {
//                this.animateChanges = false;
                this.panToCallback && this.panToCallback(this.computeNewDomain(baseDomain,d3.event.transform),true);
                (this.rootGroup.node() as any)["__zoom"] = d3.zoomIdentity.translate(0,0);;                
            })
            .on("zoom", () => {   
                this.panToCallback && this.panToCallback(this.computeNewDomain(baseDomain,d3.event.transform),false);
                return false  
            })
        
        this.rootGroup.call(zoom);

        var rect = this.rootGroup.append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "none")
            .style("pointer-events", "all");

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

        this.yAxisGenerator = d3.axisLeft(y).tickSize(-this.width);

        this.yAxisView = 
            this.rootGroup.append("g");

    }

    setPanToCallback(callback:(newDomain:number[]) => void) {
        this.panToCallback = callback;
    }

    computeNewDomain(baseDomain:number[], transform:d3.ZoomTransform) {
        let scale = transform.k*transform.k;        
        let mid = (baseDomain[1] + baseDomain[0])/2;
        let delta =  (scale != 1)? 0:(this.x.invert(0) - this.x.invert(transform.x));
        let newDomain = [ (baseDomain[0]-mid)*scale + mid + delta,(baseDomain[1]-mid)*scale + mid + delta]                    
        return newDomain;
    }

    renderInto(data:SeriesChartData) {
        let svg = d3.select(this.root);
        if(data.series.length == 0) {
            return;
        }

        let x = this.x;
        let y = this.y;


        if(data.xEnd === undefined || data.xStart === undefined) {
            this.xDomain = d3.extent(data.series[0].values,(d:any) => { 
                    return d.startTimeInMillis;
                });
        } else {
            this.xDomain = [data.xStart,data.xEnd];
        }

        // console.log("domain is",new Date(this.xDomain[0]),new Date(this.xDomain[1]));
        // console.log("times are",data.series[0].values.map(v => new Date(v.startTimeInMillis)));
        x.domain(this.xDomain);
        
        y.domain([
            Math.min(0,d3.min(data.series, series => d3.min(series.values, v => v.value))),
            d3.max(data.series, series => d3.max(series.values, v => v.value))
        ]);


        let lineGroups = this.rootGroup.selectAll(".line")
            .data(data.series,(d:any) =>  d.id);

        // console.log("changed lines:",lineGroups.size());
        // console.log("new lines:",lineGroups.enter().size());
        // console.log("dead lines:",lineGroups.exit().size());


        let exitDuration = 0;
        const sampleExitStagger = 5;
        const lineExitDuration = 50;
        // remove dead lines
        lineGroups.exit()
            .selectAll("circle")
            .transition()
            .delay((d,i) => i*sampleExitStagger)
            .duration(lineExitDuration)
            .attr("r", 0)
            
        lineGroups.exit()
            .selectAll("path")
            .transition()
            .delay((d:any) => d.length * sampleExitStagger)
            .duration(lineExitDuration)
            .attr("stroke-width", 0)

        lineGroups.exit()
            .transition()
            .delay((d:any) => {
                let dur = d.values.length * sampleExitStagger + lineExitDuration;
                exitDuration = Math.max(dur,exitDuration);
                return dur;
            })
            .remove();
// update existing lines, esp. because axes might have changed.
    //    if(this.animateChanges) {
    //         lineGroups.select("path")
    //                     .datum((d) => {return d.values})
    //                     .transition()
    //                     .delay(exitDuration)
    //                     .attr("d", this.line)
    //    } else {
    //        this.animateChanges = true;
    //         lineGroups.select("path")
    //                     .datum((d) => {return d.values})
    //                     .attr("d", this.line)
    //    }
        lineGroups.each((d,i,n) => {
            let circles = d3.select(n[i]).selectAll("circle") 
            .data(d.values,(d:any) =>  d.startTimeInMillis);
            this.animateChanges = (circles.enter().size() == 0 &&
                                    circles.exit().size() == 0);
            
            if(this.animateChanges) {
                circles.transition()
                    .delay(exitDuration)
                    .attr("cx", (d:any) => x(d.startTimeInMillis) )
                    .attr("cy", (d:any) => y(d.value) )
                circles
                    .enter()
                    .append("circle")
                        .attr("fill", "#FFFFFF")
                        .attr("stroke", d.color)
                        .attr("stroke-width", 2.5)
                        .attr("cx", d => x(d.startTimeInMillis) )
                        .attr("cy", d => y(d.value) )
                        .transition()
                        .delay((d,i) => i*10)
                        .attr("r", 2.5)            
            } else {
                circles
                    .attr("cx", (d:any) => x(d.startTimeInMillis) )
                    .attr("cy", (d:any) => y(d.value) )
                circles
                    .enter()
                    .append("circle")
                        .attr("fill", "#FFFFFF")
                        .attr("stroke", d.color)
                        .attr("stroke-width", 2.5)
                        .attr("cx", d => x(d.startTimeInMillis) )
                        .attr("cy", d => y(d.value) )
                        .attr("r", 2.5)                            
            }
            circles
                .exit()
                .remove();
        })


// update existing lines, esp. because axes might have changed.
       if(this.animateChanges) {
            lineGroups.select("path")
                        .datum((d) => {return d.values})
                        .transition()
                        .delay(exitDuration)
                        .attr("d", this.line)
       } else {
 //          this.animateChanges = true;
            lineGroups.select("path")
                        .datum((d) => {return d.values})
                        .attr("d", this.line)
       }


// create new lines
        let newLineGroups = lineGroups.enter()
                .append("g")
                .classed("line",true);

        
        newLineGroups
                    .append("path")
                    .attr("fill", "none")
                    .attr("stroke", (d) => {return d.color;})
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-width", 0)
                    .datum((d) => {return d.values})
                    .attr("d", this.line)
                    .transition()
                    .delay((d,i) => {return d.length * 10})
                    .attr("stroke-width", 2.5)

        

        newLineGroups.each((d,i,n) => {
            d3.select(n[i]).selectAll("circle") 
            .data(d.values,(d:any) =>  d.startTimeInMillis)
                .enter()
                .append("circle")
                    .attr("fill", "#FFFFFF")
                    .attr("stroke", d.color)
                    .attr("stroke-width", 2.5)
                    .attr("cx", d => x(d.startTimeInMillis) )
                    .attr("cy", d => y(d.value) )
                    .transition()
                    .delay((d,i) => i*10)
                    .attr("r", 2.5)            
        })
        
        //todo why do we need to cast as any?  type def bug, or our bug?
        let t= this.yAxisView.transition()
            .delay(exitDuration)
            .call(this.yAxisGenerator as any);
        this.yAxisView.select(".domain").remove();
        t.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke", "#CCC")
            .attr("stroke-dasharray", "2,2")
            .attr("x1",-15);

        t.selectAll(".tick text").attr("x", -8).attr("y", -5);
        
        this.xAxisView.transition()
            .delay(exitDuration)
            .call(d3.axisBottom(x) as any)
            .select(".domain").remove();

    }
}