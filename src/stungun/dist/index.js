"use strict";
/*
  we need a way to carry information over through chains,
  while not storing that data directly onto the Stungun instance.

  This way, we can do `stungun.get('key').put('value');
  and `.get('key')` doesn't get mutated for the next time we
  want to use Stungun.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peerjs_1 = __importDefault(require("peerjs"));
const ChainData_1 = __importDefault(require("./ChainData"));
class Stungun {
    constructor(opt, chainData) {
        this.apiKey = opt.apiKey || "";
        this.peer =
            opt.peer || new peerjs_1.default({ host: "localhost", port: 9000, path: "/stungun" });
        this.chainData = chainData || new ChainData_1.default();
    }
    async get(key) {
        this.chainData.path += key;
        const opts = {};
        return new ChainData_1.default(opts);
    }
    put(data) {
        if (!this.chainData.path) {
            throw new Error("path not provided. please use 'stungun.get(key)' first");
        }
        console.log(this.chainData);
    }
    once(cb) {
        if (typeof this.chainData.value === "object" &&
            this.chainData.value !== null) {
            // if there are multiple entries here (meaning the value is an object), perform the callback on each
            Object.keys(this.chainData.value).forEach((value) => {
                cb(value);
            });
        }
        else {
            // otherwise, perform the callback on the entry
            cb(this.chainData.value);
        }
    }
    async getData(key) { }
}
exports.default = Stungun;
