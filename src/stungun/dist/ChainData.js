"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChainData {
    constructor(opts) {
        this.path = (opts === null || opts === void 0 ? void 0 : opts.path) || "";
        this.value = opts === null || opts === void 0 ? void 0 : opts.value;
    }
}
exports.default = ChainData;
