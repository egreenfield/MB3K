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
var EventEmitter3_1 = require("EventEmitter3");
var BarChartView_1 = require("components/BarChartView");
var Guid_1 = require("utils/Guid");
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(dataMgr) {
        var _this = _super.call(this) || this;
        _this.dataMgr = dataMgr;
        _this.id = Guid_1.default.newGuid();
        _this.query = _this.dataMgr.newQuery("SELECT transactionName AS \"Business Transaction\", count(segments.errorList.errorCode) AS \"Error Code (Count)\" FROM transactions");
        _this.query.on("loadComplete", function () { return _this.emit("change"); });
        return _this;
    }
    Tile.prototype.getState = function () { return this.query.state; };
    Tile.prototype.load = function () {
        this.query.load();
    };
    Tile.prototype.getID = function () { return this.id; };
    Tile.prototype.getVizType = function () { return BarChartView_1.default; };
    Tile.prototype.getData = function () { return this.query.getData(); };
    return Tile;
}(EventEmitter3_1.EventEmitter));
exports.default = Tile;
//# sourceMappingURL=Tile.js.map