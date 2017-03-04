"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataQuery_1 = require("./DataQuery");
var request = require("superagent");
var DataMgr = (function () {
    function DataMgr() {
        this.queries = [];
    }
    DataMgr.prototype.newQuery = function (queryString) {
        var newQuery = new DataQuery_1.default(this, queryString);
        this.queries.push(newQuery);
        return newQuery;
    };
    DataMgr.prototype.queryByID = function (id) {
        return this.queries[0];
    };
    DataMgr.prototype.executeQuery = function (queryString) {
        return new Promise(function (fulfill, reject) {
            //			request.post("http://ec2-54-185-117-159.us-west-2.compute.amazonaws.com:9080/events/query")
            request.post("/api/events/query")
                .send(queryString)
                .set('X-Events-API-AccountName', 'customer1_23efd6e2-df72-4833-9e06-3ec32e9c951f')
                .set('X-Events-API-Key', '52dfcafc-5672-44ac-94a6-8dc78027ec3f')
                .type('application/vnd.appd.events+text;v=1')
                .end(function (err, response) {
                console.log("query response:", err, response);
                if (err)
                    reject(err);
                else
                    fulfill(response);
            });
        });
    };
    return DataMgr;
}());
exports.default = DataMgr;
//# sourceMappingURL=DataMgr.js.map