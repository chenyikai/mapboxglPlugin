import EventEmitter from "eventemitter3";
import { Map } from "mapbox-gl";
import { Feature } from "geojson";
import { ShipOptions, ShipShape, shipIcon } from "types/module/ShipManage/ship.ts";

abstract class Ship extends EventEmitter {
  _map: Map;
  _options: ShipOptions

  static NAME: string = 'ship';

  protected constructor(map: Map, options: ShipOptions) {
    super();
    this._map = map;
    this._options = options
  }

  /**
   * 船舶形状
   */
  abstract shape(): ShipShape

  /**
   * 船舶图标
   */
  abstract icon(): shipIcon

  /**
   * 真实船舶（根据位置，宽，高，方向绘制）
   */
  abstract real(): Feature
}

export default Ship
