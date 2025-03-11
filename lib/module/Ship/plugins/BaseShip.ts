import EventEmitter from "eventemitter3";
import { Map, GeoJSONSource, LngLat, Point as MapboxPoint } from "mapbox-gl";
import { BaseShipOptions, EventsControl, ShipDirection, ShipShape } from "types/module/Ship/plugins/BaseShip.ts";
import { Feature, Point } from "geojson";
import Tooltip from 'lib/core/Tooltip/index.ts'
import { SHIP_SOURCE_NAME } from "lib/module/Ship/vars.ts";

abstract class BaseShip extends EventEmitter {

  /**
   * 标识
   */
  static NAME: string = 'base'

  static SOURCE: string = SHIP_SOURCE_NAME

  _map: Map;
  _options: BaseShipOptions;
  tooltip: Tooltip | null = null;
  visible: boolean = true;

  protected constructor(map: Map, options: BaseShipOptions) {
    super();
    this._map = map;
    this._options = options;

    if (this._options.immediate && this._options.tooltip) {
      this.tooltip = new Tooltip(this._map, {
        id: this._options.id,
        className: 'mapbox-gl-ship-name-tooltip',
        position: this._options.position,
        offsetX: 5,
        offsetY: 25,
        element: this.shipName(),
        anchor: 'bottom-right'
      })
    }
  }

  abstract getId(): BaseShipOptions['id'];

  abstract getPosition(): LngLat;

  abstract getDirection(): ShipDirection;

  abstract getShape(): ShipShape | null;

  abstract getFeature(): Array<Feature>;

  /**
   * 初始化资源
   */
  abstract init(): void;

  abstract remove(): void;

  abstract setTooltip(tooltip: Tooltip): void;

  /**
   * icon形态
   */
  abstract icon(): Feature<Point>;

  /**
   * 真实形态
   */
  abstract real(): Feature;

  abstract render(): void;

  abstract shipName(): HTMLElement;

  abstract offset(): MapboxPoint

  abstract events(): EventsControl;

  /**
   * 渲染
   */
  _render(features: Array<Feature> | Feature, target?: string) {
    // const list = this.cache.get('shipList') || []
    // if (Array.isArray(features)) {
    //   this.cache.set({ name: 'shipList', content: [ ...list, ...features ] });
    // } else {
    //   this.cache.set({ name: 'shipList', content: [ ...list, features ] });
    // }

    const source: GeoJSONSource | undefined = this._map.getSource(target || BaseShip.SOURCE);
    // source?.setData({
    //   type: "FeatureCollection",
    //   features: this.cache.get('shipList')
    // })
    if (source) {
      source.updateData({
        type: "FeatureCollection",
        features: Array.isArray(features) ? features : [features]
      })
      this.emit('render', features)
    }
  }
}

export default BaseShip;
