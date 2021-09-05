import Gun from "gun";
import { IGunChainReference } from "gun/types/chain";
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
class StunConnection {
  peer: Peer;
  gun: IGunChainReference;
  dataChannels: Peer.DataConnection[];
  constructor(peer: Peer) {
    console.log("creating a new stunconnection");
    this.peer = peer;
    this.dataChannels = [];
    this.gun = new Gun({ peers: ["http://localhost:8765/gun"] });
    this.connectWithProphet();
  }

  async connectWithProphet() {
    console.log("connecting with a prophet...");
    this.gun.get("oaifmsef").once((data) => console.log("oaifmsef", data));

    // get the Network Graph using Gun.js
    this.gun.get("connecttome").once((data) => {
      console.log("data", data);
      if (!data?.peerId) {
        console.log("I AM GOD, DESTROYER OF WORLDS");
        // start listening for data connection calls
        // tell the world that we are God
        this.gun.get("oaifmsef").put({ peerId: this.peer.id });
      }
    });
  }
}

class Stungun {
  private apiKey: string;
  peer: Peer;
  path: string;
  // do we need to store `value` on the instance? Could it be replaced with local variables?
  value?: any;
  graph?: any;
  gun?: Stungun;
  connection: StunConnection;

  constructor(opts?: StungunOptions, gun?: Stungun) {
    this.apiKey = opts?.apiKey || gun?.apiKey || "";
    this.peer =
      gun?.peer ||
      new Peer({ host: "localhost", port: 9000, path: "/stungun" });
    this.path = gun?.path || "";
    this.value = gun?.value;
    this.graph = gun?.graph;
    this.gun = gun;
    this.connection = gun?.connection || new StunConnection(this.peer);
  }

  /**
    Appends a key to the path. Returns a Stungun instance.
    @param key a string to add to the path that you are referencing.
  */
  get(key: string) {
    // How else can you copy an object? Object.create() doesn't transfer all of the properties, and `const _this = this` assigns by reference, mutating the original object
    const _this = { ...this };
    console.log("GETTING!!");
    console.log("this in get", this);
    _this.path = _this.path + key;

    return new Stungun({}, _this);
  }

  /**
    Assigns a value to the path. Takes an optional callback that has an acknowledgement showing whether the put was successful, as well as the timestamp it was inserted
  */
  async put(value: any, cb?: (ack: Ack) => void) {
    if (!this.gun?.path) {
      throw new Error("path not provided. please use 'stungun.get(key)' first");
    } else {
      this.gun.value = value;
      const ack = await this.putValue();
      if (cb) {
        cb(ack);
      }
    }
  }

  /**
   *
   * Adds a value to a Set. Uses `.put()` under the hood.
   *
   * @returns an acknowledgement with a timestamp and success boolean.
   */
  async set(value: any, cb?: (ack: Ack) => void) {
    if (!this.gun?.path) {
      throw new Error("path not provided. use `stungun.get(key)` first");
    } else {
      this.gun.value = value;
      const ack = await this.setValue();
      const event = new Event(this.gun.path);
      // TODO: emit this event to the entire network
      window.dispatchEvent(event);
      if (cb) {
        cb(ack);
      }
    }
  }

  /**
   * Start broadcasting a live stream.
   * @param stream a MediaStream object. A stream of media content. A stream consists of several tracks such as video or audio tracks. Each track is specified as an instance of MediaStreamTrack.
   */

  async startLiveStreaming(stream: MediaStream) {}

  /**
    Grabs the value(s) at the key on the path. Performs the callback over the value(s).
  */
  async once(cb: (value: any, key: string) => void) {
    this.value = await this.getValue();
    if (!this.value || !this.gun) return null;
    callbackEachKey(this.value, cb);
  }

  /**
    Grabs the value(s) at the key on the path, and subscribes to any changes, performing the callback each time a value comes in.
  */
  async on(cb: (value: any, key: string) => void) {
    // return the data first
    this.value = await this.getValue();
    console.log("this.graph", this.graph);
    this.graph = this.value;
    if (!this.value || !this.gun) return null;
    callbackEachKey(this.value, cb);

    // listen for state changes (local storage changes)
    // TODO: Listen to this event on the entire network, not just the window
    window.addEventListener(this.gun.path, async () => {
      // compare with gun.graph and save the changes
      this.value = await this.getValue();
      console.log("this.value", this.value);
      let changes: any = {};
      Object.keys(this.value).filter((key) => {
        if (!Object.keys(this.graph).includes(key)) {
          changes[key] = this.value[key];
        }
      });
      // callback on the changes
      this.graph = this.value;
      console.log("this.graph", this.graph);
      callbackEachKey(changes, cb);
    });
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
        // this is cool. We can emit our own custom event here, and listen for it in our subscription methods.
        const event = new Event("stateChange");
        document.dispatchEvent(event);
        values[uuidv4()] = this.gun.value;
        this.put(values);
        resolve(new Ack(Date.now(), true));
      }
    });
  }
}

export default Stungun;

// utils; move these out eventually
function callbackEachKey(value: any, cb: (value: any, key: string) => void) {
  console.log("value in callbackEachKey:", value);
  Object.keys(value).forEach((key) => {
    cb(value[key], key);
  });
}
