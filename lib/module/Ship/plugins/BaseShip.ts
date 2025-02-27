import EventEmitter from "eventemitter3";
import { Map, GeoJSONSource } from "mapbox-gl";
import { BaseShipOptions, ShipDirection, ShipIcon, ShipShape } from "types/module/Ship/plugins/BaseShip.ts";
import { Feature } from "geojson";
import { SHIP_SOURCE_NAME } from "lib/module/Ship/vars.ts";

abstract class BaseShip extends EventEmitter {

  /**
   * 标识
   */
  static NAME: string = 'base'

  static SOURCE: string = SHIP_SOURCE_NAME

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

  /**
   * 渲染
   */
  _render(features: Array<Feature> | Feature, target?: string) {
    const source: GeoJSONSource | undefined = this._map.getSource(target || BaseShip.SOURCE);
    source?.setData({
      type: "FeatureCollection",
      features: Array.isArray(features) ? features : [features]
    })
    // if (source) {
    //   source.updateData({
    //     type: "FeatureCollection",
    //     features: Array.isArray(features) ? features : [features]
    //   })
    //   this.emit('render', features)
    // }
  }
}

export default BaseShip;
