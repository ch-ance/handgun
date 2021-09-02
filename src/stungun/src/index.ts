type GetAck = {};

// what do we put here? it should be a tree
type StungunGraph = {};

class Stungun {
  private apiKey: string;
  graph: StungunGraph | undefined;
  stungun: Stungun | undefined
    constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.graph;
    this.stungun;
  }

  get(key: string, cb: (item: any) => void): Stungun {
    const stungun = new Stungun(this.apiKey);
    stungun.graph = {}
    return stungun;
  }

  on(cb: (item: any) => void) {
  }
}

export default Stungun;
