
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
    dataGroup:d3.Selection<d3.BaseType,{},null,undefined>;
    lineLayer:d3.Selection<d3.BaseType,{},null,undefined>;
    seriesLayer:d3.Selection<d3.BaseType,{},null,undefined>;
    axisLayer:d3.Selection<d3.BaseType,{},null,undefined>;
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
    lastTimeUpdateRequested:Date = new Date();

    panToCallback:(delta:number[],reload:boolean) => void;

    constructor(svgElement:SVGElement) {
        this.root = svgElement;
        let svg = d3.select(this.root);
        let margin = {top: 20, right: 20, bottom: 30, left: 50};

        this.width = +svg.attr("width") - margin.left - margin.right;
        this.height = +svg.attr("height") - margin.top - margin.bottom;


        //clippath
         svg.append("defs").append("clipPath").attr("id","plotArea").append("rect")
            .attr("transform", "translate(0,-20)")
            .attr("width", this.width)
            .attr("height", this.height+20)
            .style("fill", "#FFAAAA")

        this.rootGroup = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        this.axisLayer = this.rootGroup.append("g");
        this.dataGroup = this.rootGroup.append("g")
            .style("clip-path","url('#plotArea')")
        this.lineLayer = this.dataGroup.append("g");
        this.seriesLayer = this.dataGroup.append("g");
        let baseDomain:number[];
        let zoom = d3.zoom()
//            .scaleExtent([0, 10])
            .on("start", () => {
                baseDomain = this.xDomain.concat();
                this.animateChanges = false;
                return false  
            })
            .on("end",() => {
//                this.animateChanges = false;
                this.panToCallback && this.panToCallback(this.computeNewDomain(baseDomain,d3.event.transform),true);
                (this.rootGroup.node() as any)["__zoom"] = d3.zoomIdentity.translate(0,0);;                
                this.animateChanges = true;
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
       
        this.xAxisView = this.axisLayer.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            // .select(".domain")
            // .remove();

        this.yAxisGenerator = d3.axisLeft(y).tickSize(-this.width);

        this.yAxisView = 
            this.axisLayer.append("g");

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


        let lineGroups = this.seriesLayer.selectAll(".line")
            .data(data.series,(d:any) =>  d.id);

        if(this.animateChanges) {
//          this.animateChanges = true;
            lineGroups.select("path")
                        .datum((d) => {return d.values})
                        .attr("d", this.line)
             
        }
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




        let exitDuration = 0;
        const sampleExitStagger = 5;
        const lineExitDuration = 50;
        // remove dead lines
        if(this.animateChanges) {

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
        } else {
            
            lineGroups.exit()
            .remove();
            
        }
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
        let lineIsSameData = true;
        lineGroups.each((d,i,n) => {
            let circles = d3.select(n[i]).selectAll("circle") 
            .data(d.values,(d:any) =>  d.startTimeInMillis);
            //  lineIsSameData = lineIsSameData && (circles.enter().size() == 0 &&
            //                          circles.exit().size() == 0);
            
            if(this.animateChanges && lineIsSameData) {
                circles.transition()
                    .delay(exitDuration)
                    .attr("cx", (d:any) => x(d.startTimeInMillis) )
                    .attr("cy", (d:any) => y(d.value) )
                circles
                    .enter()
                    .append("circle")
                        .attr("fill", "#FFFFFF")
                        .attr("stroke", d.color)
                        .attr("stroke-width", 1)
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
                        .attr("stroke-width", 1)
                        .attr("cx", d => x(d.startTimeInMillis) )
                        .attr("cy", d => y(d.value) )
                        .attr("r", 2.5)                            
            }
            circles
                .exit()
                .remove();
        })


// update existing lines, esp. because axes might have changed.
       if(this.animateChanges && lineIsSameData) {
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
                    .attr("stroke-width", 1)

        

        newLineGroups.each((d,i,n) => {
            d3.select(n[i]).selectAll("circle") 
            .data(d.values,(d:any) =>  d.startTimeInMillis)
                .enter()
                .append("circle")
                    .attr("fill", "#FFFFFF")
                    .attr("stroke", d.color)
                    .attr("stroke-width", 1)
                    .attr("cx", d => x(d.startTimeInMillis) )
                    .attr("cy", d => y(d.value) )
                    .transition()
                    .delay((d,i) => i*10)
                    .attr("r", 2.5)            
        })
        
        //todo why do we need to cast as any?  type def bug, or our bug?
        if(this.animateChanges) {
            let t= this.yAxisView.transition()
                .delay(exitDuration)
                .call(this.yAxisGenerator as any);
            this.yAxisView.select(".domain").remove();
            t.selectAll(".tick:not(:first-of-type) line")
                .attr("stroke", "#EEE")
//                .attr("stroke-dasharray", "2,2")
                .attr("x1",-15);

            t.selectAll(".tick text").attr("x", -8).attr("y", -5);
            
            this.xAxisView.transition()
                .delay(exitDuration)
                .call(d3.axisBottom(x) as any)
                .select(".domain").remove();            
        } else {
            let t= this.yAxisView
                .call(this.yAxisGenerator as any);
            this.yAxisView.select(".domain").remove();
            t.selectAll(".tick:not(:first-of-type) line")
                .attr("stroke", "#CCC")
                .attr("stroke-dasharray", "2,2")
                .attr("x1",-15);

            t.selectAll(".tick text").attr("x", -8).attr("y", -5);
            
            this.xAxisView
                .call(d3.axisBottom(x) as any)
                .select(".domain").remove();                        
        }

        this.drawTimeMarkers();

        
    }
          
          

    drawTimeMarkers() {
        const secInMilli = 1000,
            minuteInMilli = 60 * secInMilli,
            hourInMilli = 60 * minuteInMilli,
            dayInMilli = 24 * hourInMilli,
            weekInMilli = 7 * dayInMilli,
            monthInMilli = 30 * dayInMilli,
            yearInMilli = 365 * dayInMilli;
        const maxDividers = 5;
        let x = this.x;

        let ticks:Date[] = x.ticks();
        let xdist = this.xDomain[1] - this.xDomain[0];
    
        let matchTicks:Date[] = [];        
        let candidates:Date[] = ticks;
        let label:string = "minute";
        candidates.forEach( t=> {
            if(t.getSeconds() == 0) {matchTicks.push(t)};
        });

        if (matchTicks.length > maxDividers) {
            label = "hour";
            candidates = matchTicks;matchTicks = [];
            candidates.forEach( t=> {
                if(t.getMinutes() == 0) {matchTicks.push(t)};
            });
        }
        if (matchTicks.length > maxDividers) {
            label = "day";
            candidates = matchTicks;matchTicks = [];
            candidates.forEach( t=> {
                if(t.getHours() == 0) {matchTicks.push(t)};
            });
        }
        if(matchTicks.length > maxDividers) {
            label = "week";
            candidates = matchTicks;matchTicks = [];
            candidates.forEach( t=> {
                if(t.getDay() == 0) {matchTicks.push(t)};
            });
        }
        if(matchTicks.length > maxDividers) {
            label = "month";
            candidates = matchTicks;matchTicks = [];
            candidates.forEach( t=> {
                if(t.getDate() == 0) {matchTicks.push(t)};
            });
        }
        if (matchTicks.length > maxDividers) {
            label = "year";
            candidates = matchTicks;matchTicks = [];
            candidates.forEach( t=> {
                if(t.getMonth() == 0) {matchTicks.push(t)};
            });
        }
//        console.log("found ",markedTicks.length,"at scale ",markerScale);
        
        let lineMarkers = this.lineLayer
                            .selectAll(".timeMarker")
                            .data(matchTicks,(d:any) => d.getTime());

        //console.log("changing",lineMarkers.size(),"creating",lineMarkers.enter().size(),"destroying",lineMarkers.exit().size());

        let newLines = lineMarkers
            .enter()
            .append("g")
            .classed("timeMarker",true);

            newLines
            .append("line")
            .attr("stroke","#CCC")
            .attr("stroke-width", 1)            
            .attr("stroke-dasharray", "5,2")
            .attr("y1",-20)
            .attr("y2",this.height+20)
            .attr("x1",0)
            .attr("x2",0)
            
            newLines
            .transition()
            .duration(100)
            .attr("opacity",1)
        	
            newLines.append("text")
                .classed("timeMarkerLabel",true)
		        .attr("transform", "translate(10,-20) rotate(-90)")
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
    		.style("fill", "#CCC")
        		.text(label);

        lineMarkers.exit()
            .transition()
            .duration(100)
            .attr("opacity",0)
            .remove();

        lineMarkers.select(".timeMarkerLabel")
            .text(label);

        let allLineMarkers = this.lineLayer
                            .selectAll(".timeMarker")
        allLineMarkers
		    .attr("transform", d => "translate(" + (x(d)) + ",0)")
    }
}