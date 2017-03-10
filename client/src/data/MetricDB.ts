import * as request from "superagent";

export default class MetricDB {

    allMetrics:string[] = [];
    tierAndNodes:{[tier: string]: string[]} ={};
    load() {
        let thisDB = this;
        request.get("http://localhost:8080/api/test-metrics")
            .end((err,response) => {
                if (err) {
                    console.log("Failed to load metrics DB: " + err);
                }
                thisDB.allMetrics = JSON.parse(response.text);
           //     this.findRelated('Application Infrastructure Performance|Authentication-Service|Individual Nodes|AD-Capital_REST_NODE|JVM|Process CPU Usage %');
           //     this.findRelated('Application Infrastructure Performance|Authentication-Service|JVM|Process CPU Usage %');
            });
    }

    find(query: String):String[] {

        if (query.length == 0) {
            return [];
        }

        var result:any[] = [];
        for (var i = 0; i < this.allMetrics.length; i++) {
            let metric = this.allMetrics[i];
            var matchSegments:any = this.fuzzyMatch(query, metric);
            if (matchSegments != null) {
                result.push({metric:metric, segments:matchSegments});
            }
        }

        return result;
    }

    fuzzyMatch(search:String, haystack:String):any {

        if (search == "") {
            return null;
        }

        var searchParts:String[] = search.split("|");
        var haystackParts:String[] = haystack.split("|");

        var segments:any[] = [];

        // Consume each segment of the search string by matching them
        // If we run out of haystack, fail
        // If we run out of search, succeed
        while (searchParts.length > 0) {
            var searchPart:String = searchParts.shift();

            // Consume haystack until we run out (then fail), or match
            while (true) {
                if (haystackParts.length == 0) {
                    return null;
                }

                var haystackPart:String = haystackParts.shift();
                let matchStart = haystackPart.toLocaleLowerCase().indexOf(searchPart.toLocaleLowerCase());

                if (matchStart >= 0) {
                    let matchEnd = matchStart + searchPart.length;

                    if (matchStart > 0) {
                        segments.push({text:haystackPart.substring(0, matchStart), match:false});
                    }
                    segments.push({text:haystackPart.substring(matchStart, matchEnd), match: true});
                    if (matchEnd < haystackPart.length) {
                        segments.push({text:haystackPart.substring(matchEnd), match:false})
                    }

                    if (haystackParts.length > 0) {
                        segments.push({text: "|", match: false});
                    }
                    // Jump to the next search part
                    break;
                } else {
                    segments.push({text:haystackPart, match:false});
                    if (haystackParts.length > 0) {
                        segments.push({text: "|", match: false});
                    }
                }
            }
        }

        segments.push({text:haystackParts.join("|"), match:false});

        // We ran out of search parts, meaning they all got matched
        // So return a positive result
        return segments;
    }

    findRelated(query: string) {
        if (query.length == 0) {
            return [];
        }

        var result:any[] = [];
        for (var i = 0; i < this.allMetrics.length; i++) {
            let metric = this.allMetrics[i];
            if (this.isRelatedMetrics(query, metric)) {
                result.push(metric);
            }
        }
 //       console.log(query + " is related to ");
 //       console.log(result);
        return result;
    }

    isRelatedMetrics(search: String, haystack: String):boolean {
        if (search == "") {
            return null;
        }
        if ( search == haystack) {
            return false;
        }
        var searchParts:string[] = search.split("|");
        var haystackParts:string[] = haystack.split("|");

        var index=search.indexOf('Individual Nodes');

        // search is node level metrics
        if (index >= 0) {
            if (haystack.length >= index) {
                if (haystack.substr(0, index) != search.substr(0, index)) {
                    return false;
                } else {
                    if (!(haystack.indexOf(search.substr(search.indexOf("|", index+'Individual Nodes'.length+1))) > 0)) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else { // search is a tier metrics
            for (var i = 0; i < searchParts.length; i++) {
                if (!this.contains(haystackParts, searchParts[i])) {
                    return false;
                }
            }
        }
        return true;
    }

    contains(a: string[], element:string): boolean{
        var i = a.length;
        while (i--) {
            if (a[i] == element) {
                return true;
            }
        }
        return false;
    }


    // buildTiersAndNodes() {
    //
    //     for (var i = 0; i < this.allMetrics.length; i++) {
    //         var metric = this.allMetrics[i];
    //         if (metric.indexOf("Overall Application Performance|")<0) {
    //             continue;
    //         }
    //         var parts = metric.split("|");
    //         for (var j = 0; j < parts.length; j++) {
    //             if (parts[j] == "Individual Nodes") {
    //                 this.tierAndNodes[parts[j - 1]] =
    //                     this.tierAndNodes[parts[j - 1]] || [];
    //                 if (! this.contains(this.tierAndNodes[parts[j - 1]], parts[j + 1])) {
    //                     this.tierAndNodes[parts[j - 1]].push(parts[j + 1]);
    //                 }
    //                 break;
    //             }
    //         }
    //
    //     }
    //
    //    // console.log(this.tierAndNodes);
    // }

}