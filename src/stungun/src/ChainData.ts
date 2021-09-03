interface ChainDataOpts {
  path?: string;
  value?: any;
}

class ChainData {
  path: string;
  value: any;
  constructor(opts?: ChainDataOpts) {
    this.path = opts?.path || "";
    this.value = opts?.value;
  }
}

export default ChainData;
