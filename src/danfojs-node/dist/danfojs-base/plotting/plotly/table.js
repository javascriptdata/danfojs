"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tablePlot = void 0;
/**
* Display Series or DataFrame as table.
* Uses the Plotly as backend, so supoorts Plotly's configuration parameters,
* @param ndframe Series or DataFrame to plot
* @param divId HTML div id to plot in.
* @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
*/
var tablePlot = function (ndframe, divId, plotConfig, Plotly) {
    var config = plotConfig["config"];
    var layout = plotConfig["layout"];
    var header = {};
    var cells = {};
    var colsData = [];
    var cols2Show = [];
    if (config['columns']) {
        config['columns'].forEach(function (cname) {
            if (!ndframe.columns.includes(cname)) {
                throw Error("Column Error: " + cname + " not found in columns. Columns should be one of [ " + ndframe.columns + " ]");
            }
            var idx = ndframe.columns.indexOf(cname);
            colsData.push(ndframe.getColumnData[idx]);
        });
        cols2Show = config['columns'];
    }
    else {
        cols2Show = ndframe.columns;
        colsData = ndframe.getColumnData;
    }
    header['values'] = cols2Show.map(function (col) { return [col]; });
    cells['values'] = colsData;
    if (config['tableHeaderStyle']) {
        Object.keys(config['tableHeaderStyle']).forEach(function (param) {
            header[param] = config['tableHeaderStyle'][param];
        });
    }
    if (config['tableCellStyle']) {
        Object.keys(config['tableCellStyle']).forEach(function (param) {
            cells[param] = config['tableCellStyle'][param];
        });
    }
    var trace = {
        type: 'table',
        header: header,
        cells: cells
    };
    /* @ts-ignore */
    Plotly.newPlot(divId, [trace], layout, config);
};
exports.tablePlot = tablePlot;
