import type { Map } from 'mapbox-gl';

class Store {

  static _instance: Store | null = null;

  _map: Map;

  private constructor(map: Map) {
    this._map = map;
  }

  static getInstance(map: Map): Store {
    if (Store._instance) {
      return Store._instance;
    } else {
      Store._instance = new Store(map);
      return Store._instance;
    }
  }
}

export default Store
