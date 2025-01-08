import EventEmitter from 'eventemitter3'
import type { Map } from "mapbox-gl";
import { DrawOptions } from 'types/module/Draw'

class Draw extends EventEmitter {
  _map: Map;
  _options: DrawOptions;

  constructor(map: Map, options: DrawOptions) {
    super();
    this._options = options;
    this._map = map;
  }
  
  factory() {}

  start(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (true) {
        resolve('1')
      } else {
        reject()
      }
    })
  }

  stop() {}

  create() {}

  delete() {}

  deleteAll() {}

  update() {}

  updateVertex() {}

  get() {}

  select() {}

  position() {}

  install() {}

  _render() {}
}

export default Draw;
