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
var Tile_1 = require("./Tile");
var eventemitter3_1 = require("eventemitter3");
var Dashboard = (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard(dataMgr) {
        var _this = _super.call(this) || this;
        _this.tiles = [];
        _this.name = "New Dashboard";
        _this.dataMgr = dataMgr;
        return _this;
    }
    Dashboard.prototype.addTile = function () {
        var _this = this;
        var newTile = new Tile_1.default(this.dataMgr);
        newTile.on("change", function () { _this.emit("change"); });
        this.tiles.push(newTile);
        this.emit("change");
        return newTile;
    };
    Dashboard.prototype.getTiles = function () {
        return this.tiles.concat();
    };
    Dashboard.prototype.load = function () {
        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
            var aTile = _a[_i];
            aTile.load();
        }
    };
    return Dashboard;
}(eventemitter3_1.EventEmitter));
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map