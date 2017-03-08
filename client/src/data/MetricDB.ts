import * as request from "superagent";

export default class MetricDB {

    allMetrics:String[] = [];

    load() {
        let thisDB = this;
        request.get("http://localhost:8080/api/test-metrics")
            .end((err,response) => {
                if (err) {
                    console.log("Failed to load metrics DB: " + err);
                }
                thisDB.allMetrics = JSON.parse(response.text);
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

        console.log("Searching for " + search + " in " + haystack)

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
}