/*
  we need a way to carry information over through chains, 
  while not storing that data directly onto the Stungun instance.

  This way, we can do `stungun.get('key').put('value');
  and `.get('key')` doesn't get mutated for the next time we 
  want to use Stungun.
*/

import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

export interface StungunOptions {
  apiKey?: string;
}

class Ack {
  timestamp: number;
  success: boolean;
  constructor(timestamp: number, success: boolean) {
    this.timestamp = timestamp;
    this.success = success;
  }
}
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

  constructor(opts?: StungunOptions, gun?: Stungun) {
    this.apiKey = opts?.apiKey || "";
    this.peer =
      gun?.peer ||
      new Peer({ host: "localhost", port: 9000, path: "/stungun" });
    this.path = gun?.path || "";
    this.value = gun?.value;
    this.gun = gun;
    this.connection = gun?.connection || new StungunConnection(this.peer);
  }

  /*
    Appends a key to the path. Returns a Stungun instance.
  */
  get(key: string) {
    // How else can you copy an object? Object.create() doesn't transfer all of the properties, and `const _this = this` assigns by reference, mutating the original object
    const _this = { ...this };
    _this.path = _this.path + key;

    return new Stungun({}, _this);
  }

  /*
    Assigns a value to the path. Takes an optional callback that has an acknowledgement showing whether the put was successful, as well as the timestamp it was inserted
  */
  async put(value: any, cb?: (ack: Ack) => void) {
    if (!this.gun?.path) {
      throw new Error("path not provided. please use 'stungun.get(key)' first");
    } else {
      console.log("this.gun.path:", this.gun.path);
      this.gun.value = value;
      const ack = await this.putValue();
      if (cb) {
        cb(ack);
      }
    }
  }

  async set(value: any, cb?: (ack: Ack) => void) {
    if (!this.gun?.path) {
      throw new Error("path not provided. use `stungun.get(key)` first");
    } else {
      this.gun.value = value;
      const ack = await this.setValue();
      if (cb) {
        cb(ack);
      }
    }
  }

  /*
    Grabs the value(s) at the key on the path. Performs the callback over the value(s).
  */
  async once(cb: (value: any, key: string) => void) {
    this.value = await this.getValue();
    if (!this.value) return null;
    Object.keys(this.value).forEach((key) => {
      cb(this.value[key], key);
    });
  }

  /*
    Grabs the value(s) at the key on the path, and subscribes to any changes, performing the callback each time a value comes in.
  */
  async on(cb: (value: any, key: string) => void) {
    // this.value =
  }

  private async getValue() {
    return new Promise(async (resolve, reject) => {
      if (!this.gun?.path) {
        reject("no path. Need to use `.get(key)` first");
      } else {
        resolve(JSON.parse(localStorage.getItem(this.gun.path) as string));
      }
    });
  }

  private async putValue(): Promise<Ack> {
    return new Promise(async (resolve, reject) => {
      if (!this.gun?.path || !this.gun?.value) {
        reject(new Ack(Date.now(), false));
      } else {
        const value =
          typeof this.gun.value === "object"
            ? JSON.stringify(this.gun.value)
            : JSON.stringify({ [uuidv4()]: this.gun.value });

        localStorage.setItem(this.gun.path, value);
        resolve(new Ack(Date.now(), true));
      }
    });
  }

  private async setValue(): Promise<Ack> {
    return new Promise(async (resolve, reject) => {
      if (!this.gun?.path || !this.gun?.value) {
        reject(new Ack(Date.now(), false));
      } else {
        // we get the value(s) at the path, and then append our new value
        const values = Object.create({});
        await this.once((value, key) => (values[key] = value));
        values[uuidv4()] = this.gun.value;
        this.put(values);
        resolve(new Ack(Date.now(), true));
      }
    });
  }
}

export default Stungun;
