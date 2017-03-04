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
var TileView = (function (_super) {
    __extends(TileView, _super);
    function TileView(props) {
        return _super.call(this, props) || this;
    }
    TileView.prototype.render = function () {
        var VizType = this.props.tile.getVizType();
        return (React.createElement("div", { className: "Tile" },
            this.props.tile.getState(),
            (this.props.tile.getState() == "loaded") &&
                React.createElement(VizType, { data: this.props.tile.getData() })));
    };
    return TileView;
}(React.Component));
exports.default = TileView;
//# sourceMappingURL=TileView.js.map