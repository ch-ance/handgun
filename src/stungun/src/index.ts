/*
  we need a way to carry information over through chains, 
  while not storing that data directly onto the Stungun instance.

  This way, we can do `stungun.get('key').put('value');
  and `.get('key')` doesn't get mutated for the next time we 
  want to use Stungun.
*/

import Peer from "peerjs";
import ChainData from "./ChainData";

interface StungunOptions {
  apiKey?: string;
  peer?: Peer;
}
class Stungun {
  private apiKey: string;
  peer: Peer;
  chainData: ChainData;

  constructor(opt: StungunOptions, chainData?: ChainData) {
    this.apiKey = opt.apiKey || "";
    this.peer =
      opt.peer || new Peer({ host: "localhost", port: 9000, path: "/stungun" });
    this.chainData = chainData || new ChainData();
  }

  async get(key: string) {
    this.chainData.path += key;
    const opts: StungunOptions = {
      apiKey: this.apiKey,
    };

    return new Stungun(opts);
  }

  put(data: any) {
    if (!this.chainData.path) {
      throw new Error("path not provided. please use 'stungun.get(key)' first");
    }
    console.log(this.chainData)
  }

  once(cb: (item: any) => void) {
    if (
      typeof this.chainData.value === "object" &&
      this.chainData.value !== null
    ) {
      // if there are multiple entries here (meaning the value is an object), perform the callback on each
      Object.keys(this.chainData.value).forEach((value) => {
        cb!(value);
      });
    } else {
      // otherwise, perform the callback on the entry
      cb(this.chainData.value);
    }
  }

  private async getData(key: string) {}
}

export default Stungun;
