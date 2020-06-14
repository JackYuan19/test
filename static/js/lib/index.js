"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var filterArr = exports.filterArr = function filterArr(arr, index) {
    var filterArr = arr.filter(function (value) {
        return index !== value;
    });
    return filterArr;
};