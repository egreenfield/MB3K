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
/*
    ./client/components/App.jsx
*/
var React = require("react");
var DashboardView_1 = require("./DashboardView");
var App = (function (_super) {
    __extends(App, _super);
    function App(props) {
        return _super.call(this, props) || this;
    }
    App.prototype.render = function () {
        return (React.createElement("div", { style: { textAlign: 'center' } },
            React.createElement("h1", null, "Hello World"),
            React.createElement(DashboardView_1.default, { dashboard: this.props.dashboard })));
    };
    return App;
}(React.Component));
exports.default = App;
//# sourceMappingURL=App.js.map