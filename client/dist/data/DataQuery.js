"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = require("eventemitter3");
var DataQuery = (function (_super) {
    __extends(DataQuery, _super);
    function DataQuery(mgr, queryString) {
        var _this = _super.call(this) || this;
        _this.mgr = mgr;
        _this.queryString = queryString;
        _this.state = "unloaded";
        return _this;
    }
    DataQuery.prototype.getState = function () { return this.state; };
    DataQuery.prototype.load = function () {
        var _this = this;
        switch (this.state) {
            case "loading":
            case "loaded":
                break;
            case "unloaded":
                this.state = "loading";
                this.mgr.executeQuery(this.queryString).then(function (data) {
                    _this.data = data;
                    _this.state = "loaded";
                    _this.emit("loadComplete");
                });
        }
    };
    DataQuery.prototype.getData = function () { return this.data; };
    return DataQuery;
}(eventemitter3_1.EventEmitter));
exports.default = DataQuery;
//# sourceMappingURL=DataQuery.js.map