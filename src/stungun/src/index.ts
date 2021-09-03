/*
  we need a way to carry information over through chains, 
  while not storing that data directly onto the Stungun instance.

  This way, we can do `stungun.get('key').put('value');
  and `.get('key')` doesn't get mutated for the next time we 
  want to use Stungun.
*/

import Peer from "peerjs";

export interface StungunOptions {
  apiKey?: string;
  peer?: Peer;
  path?: string;
  value?: any;
  gun?: Stungun;
  connection?: StungunConnection;
}

type Ack = {};

class StungunConnection {
  constructor(peer: Peer) {}
}

class Stungun {
  private apiKey: string;
  peer: Peer;
  path: string;
  value?: any;
  gun?: Stungun;
  connection?: StungunConnection;

  constructor(opts?: StungunOptions) {
    this.apiKey = opts?.apiKey || "";
    this.peer =
      opts?.peer ||
      new Peer({ host: "localhost", port: 9000, path: "/stungun" });
    this.path = opts?.path || "";
    this.value = opts?.value;
    this.gun = opts?.gun;
    this.connection = opts?.connection || new StungunConnection(this.peer);
  }

  /*
    Appends a key to the path. Returns a Stungun instance.
  */
  get(key: string) {
    // How else can you copy an object? Object.create() doesn't transfer all of the properties, and `const _this = this` assigns by reference, mutating the original object
    const _this = { ...this };
    _this.path = _this.path + key;

    return new Stungun({ gun: _this });
  }

  async put(value: any, cb?: Ack) {
    if (!this.gun?.path) {
      throw new Error("path not provided. please use 'stungun.get(key)' first");
    } else {
      console.log("this.gun.path:", this.gun.path);
      this.gun.value = value;
      const ack = await this.putValue();
      console.log("ack", ack);
    }
  }

  async once(cb: (item: any) => void) {
    this.value = await this.getValue();
    if (typeof this.value === "object" && this.value !== null) {
      // if there are multiple entries here (meaning the value is an object), perform the callback on each.
      // does this make sense? should it always be an object? ({key: key})
      Object.keys(this.value).forEach((value) => {
        cb(value);
      });
    } else {
      // otherwise, perform the callback on the entry
      cb(this.value);
    }
  }

  private async getValue() {
    return new Promise(async (resolve, reject) => {
      if (!this.gun?.path) {
        reject("no path. Need to use `.get(key)` first");
      } else {
        resolve(
          await JSON.parse(localStorage.getItem(this.gun.path) as string)
        );
      }
    });
  }

  private async putValue() {
    return new Promise(async (resolve, reject) => {
      if (!this.gun?.path || !this.gun?.value) {
        reject("need path. use gun.get() first");
      } else {
        resolve(
          localStorage.setItem(this.gun.path, JSON.stringify(this.gun.value))
        );
      }
    });
  }
}

export default Stungun;
