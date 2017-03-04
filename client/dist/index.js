"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    ./client/index.js
    which is the webpack entry file
*/
var React = require("react");
var ReactDOM = require("react-dom");
var App_1 = require("./components/App");
var Dashboard_1 = require("./model/Dashboard");
var DataMgr_1 = require("./data/DataMgr");
var dataMgr = new DataMgr_1.default();
var dashboard = new Dashboard_1.default(dataMgr);
dashboard.addTile();
dashboard.load();
ReactDOM.render(React.createElement(App_1.default, { dataMgr: dataMgr, dashboard: dashboard }), document.getElementById('root'));
exports.default = {};
//# sourceMappingURL=index.js.map