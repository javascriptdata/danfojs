"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = __importDefault(require("../core/frame"));
var series_1 = __importDefault(require("../core/series"));
var Rolling = /** @class */ (function () {
    function Rolling(data, windowSize) {
        this.data = data;
        this.windowSize = windowSize;
        this.rollingDf = this.rolling();
    }
    Rolling.prototype.rolling = function () {
        var dfData = [];
        for (var i = 0; i < this.windowSize; i++) {
            if (i == 0) {
                dfData.push(this.data.values);
            }
            else {
                dfData.push(this.data.shift(i).values);
            }
        }
        return new frame_1.default(dfData);
    };
    Rolling.prototype.print = function () {
        this.rollingDf.print();
    };
    Rolling.prototype.sum = function () {
        return new series_1.default(this.rollingDf.tensor.sum(0));
    };
    Rolling.prototype.mean = function () {
        return new series_1.default(this.rollingDf.tensor.mean(0));
    };
    Rolling.prototype.max = function () {
        return new series_1.default(this.rollingDf.tensor.max(0));
    };
    Rolling.prototype.min = function () {
        return new series_1.default(this.rollingDf.tensor.min(0));
    };
    Rolling.prototype.prod = function () {
        //multi
        return new series_1.default(this.rollingDf.tensor.prod(0));
    };
    Rolling.prototype.any = function () {
        // one of data true
        return new series_1.default(this.rollingDf.tensor.any(0));
    };
    Rolling.prototype.all = function () {
        // all of data true
        return new series_1.default(this.rollingDf.tensor.all(0));
    };
    return Rolling;
}());
exports.default = Rolling;
