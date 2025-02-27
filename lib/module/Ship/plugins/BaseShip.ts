import EventEmitter from "eventemitter3";
import { Map } from "mapbox-gl";
import { BaseShipOptions, ShipDirection, ShipIcon, ShipShape } from "types/module/Ship/plugins/BaseShip.ts";
import { Feature } from "geojson";

abstract class BaseShip extends EventEmitter {

  /**
   * 标识
   */
  static NAME: string = 'base'

  _map: Map;
  _options: BaseShipOptions;

  protected constructor(map: Map, options: BaseShipOptions) {
    super();
    this._map = map;
    this._options = options;
  }

  abstract get direction(): ShipDirection;

  abstract get shape(): ShipShape | null;

  abstract get feature(): Array<Feature>;

  /**
   * 初始化资源
   */
  abstract init(): void;

  /**
   * icon形态
   */
  abstract icon(): ShipIcon;

  /**
   * 真实形态
   */
  abstract real(): Feature;
}

export default BaseShip;
