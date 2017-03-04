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
var React = require("react");
var TileView_1 = require("./TileView");
var DashboardView = (function (_super) {
    __extends(DashboardView, _super);
    function DashboardView(props) {
        var _this = _super.call(this, props) || this;
        props.dashboard.on("change", function () {
            _this.forceUpdate();
        });
        return _this;
    }
    DashboardView.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { style: { textAlign: 'center' } },
                React.createElement("h1", null, this.props.dashboard.name)),
            React.createElement("div", null, this.props.dashboard.getTiles().map(function (tile) { return React.createElement(TileView_1.default, { tile: tile, key: tile.getID() }); }))));
    };
    return DashboardView;
}(React.Component));
exports.default = DashboardView;
//# sourceMappingURL=DashboardView.js.map