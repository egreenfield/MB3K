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

        let parts = query.split("|")
        let regex = ".*" + parts.join(".*\\|.*") + ".*"

        return this.allMetrics.filter((metric:String):Boolean => { return metric.match(regex) != null })
    }
}