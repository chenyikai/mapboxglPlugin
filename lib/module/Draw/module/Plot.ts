import EventEmitter from 'eventemitter3'
import { GeoJSONSource, LayerSpecification, Map, MapMouseEvent } from "mapbox-gl";
import { Feature, Position, GeoJsonProperties } from "geojson";
import { addSource, addLayer } from "lib/utils/util.ts";
import { plotEvent } from 'types/module/Draw/plot.ts'
import { COLD, HOT } from "lib/module/Draw/module/vars.ts";

abstract class Plot extends EventEmitter {
  _map: Map;
  isVisible: boolean = true;
  isCheck: boolean = true;
  isHover: boolean = false;
  source: string = COLD;
  sourceName: string;

  abstract id: string;
  abstract coordinates: Position | Array<Position> | unknown;
  abstract properties: GeoJsonProperties;
  abstract _event: plotEvent;

  protected constructor(map: Map, source: string, layers: Array<LayerSpecification> | LayerSpecification) {
    super();
    this._map = map;
    this.sourceName = source;

    addSource(this._map, this.sourceName, {
      type: 'geojson',
      dynamic: true,
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    if (Array.isArray(layers)) {
      layers.forEach(layer => addLayer(this._map, layer));
    } else {
      addLayer(this._map, layers);
    }
  }

  /**
   * 开始
   */
  abstract start(): void;

  /**
   * 定位
   */
  abstract position(): void;

  /**
   * 选中
   */
  abstract select(): void;

  /**
   * 取消选中
   */
  abstract unselect(): void;

  /**
   * 聚焦
   */
  abstract focus(): void;

  abstract _createFunc(value: boolean): void;

  abstract _updateFunc(value: boolean): void;

  abstract _residentFunc(value: boolean): void;

  /**
   * 移动
   * @param value 目标位置
   */
  abstract move(value: Position): void;

  check(): void {
    this.isCheck = true;
  }

  unCheck(): void {
    this.isCheck = false;
  };

  hover(): void {
    this.isHover = true;
    this.hot();
  }

  unHover() {
    this.isHover = false;
    this.cold();
  }

  visible() {
    this.isVisible = true;
  }

  unVisible() {
    this.isVisible = false;
  }

  hot() {
    this.source = HOT;
  }

  cold() {
    this.source = COLD;
  }

  /**
   * 渲染
   */
  _render(features: Array<Feature> | Feature) {
    const source: GeoJSONSource | undefined = this._map.getSource(this.sourceName);
    if (source) {
      source.updateData({
        type: "FeatureCollection",
        features: Array.isArray(features) ? features : [features]
      })
    }
  }

  setCursor(cursor: string) {
    const container = this._map.getContainer();
    container.style.cursor = cursor;
  }

  isSelf(feature: Feature): boolean {
    return feature.properties?.id === this.id || feature.id === this.id || feature.properties?.belong === this.id;
  }

  isSelfUnderMouse(e: MapMouseEvent): boolean {
    if (e.features?.length) {
      const feature = e.features[0]
      return this.isSelf(feature)
    }

    return false;
  }
}

export default Plot;
