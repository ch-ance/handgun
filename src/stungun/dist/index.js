"use strict";
exports.__esModule = true;
var Stungun = /** @class */ (function () {
    function Stungun(apiKey) {
        this.apiKey = apiKey;
        this.graph;
        this.stungun;
    }
    Stungun.prototype.get = function (key, cb) {
        var stungun = new Stungun(this.apiKey);
        stungun.graph = {};
        return stungun;
    };
    Stungun.prototype.on = function (cb) {
    };
    return Stungun;
}());
exports["default"] = Stungun;
