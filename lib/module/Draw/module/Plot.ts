import EventEmitter from 'eventemitter3'
import { GeoJSONSource, LayerSpecification, Map, MapMouseEvent } from "mapbox-gl";
import { Feature, Position, GeoJsonProperties } from "geojson";
import { addSource, addLayer } from "lib/utils/util.ts";
import { plotEvent } from 'types/module/Draw/plot.ts'
import { COLD, FOCUS_LAYER, FOCUS_LAYER_NAME, FOCUS_SOURCE_NAME, HOT } from "lib/module/Draw/module/vars.ts";

abstract class Plot extends EventEmitter {
  _map: Map;
  isVisible: boolean = true;

  isCheck: boolean = true;

  isHover: boolean = false;
  hoverFeature: Feature | null = null;

  source: string = COLD;
  sourceName: string;

  lastCursor: string = "";

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

    this._initFocus();
  }

  /**
   * 开始
   */
  abstract start(): void;

  /**
   * 更新
   * @param value 目标位置
   */
  abstract update(value: Position): void;

  /**
   * 移除
   */
  abstract remove() :void;

  /**
   * 定位
   */
  abstract position(): void;

  /**
   * 移动
   * @param value 目标位置
   */
  abstract move(value: Position): void;

  /**
   * 选中
   */
  abstract select(): void;

  /**
   * 取消选中
   */
  abstract unSelect(): void;

  /**
   * 聚焦
   */
  abstract focus(): void;

  /**
   * 取消聚焦
   */
  abstract unFocus(): void;

  abstract refresh(): void;

  abstract _createFunc(value: boolean): void;

  abstract _updateFunc(value: boolean): void;

  abstract _residentFunc(value: boolean): void;

  check(): void {
    this.isCheck = true;
  }

  unCheck(): void {
    this.isCheck = false;
  };

  hover(feature: Feature): void {
    this.hoverFeature = feature;
    this.lastCursor = this._map.getContainer().style.cursor;
    this.isHover = true;
    this.setCursor('pointer');
    this.hot();
  }

  unHover() {
    this.hoverFeature = null;
    this.isHover = false;
    this.setCursor(this.lastCursor);
    this.lastCursor = '';
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
  _render(features: Array<Feature> | Feature, target?: string) {
    const source: GeoJSONSource | undefined = this._map.getSource(target || this.sourceName);
    if (source) {
      source.updateData({
        type: "FeatureCollection",
        features: Array.isArray(features) ? features : [features]
      })
      this.emit('render', features)
    }
  }

  setCursor(cursor: string) {
    const container = this._map.getContainer();
    container.style.cursor = cursor;
  }

  getCursor(): string {
    return this._map.getContainer().style.cursor;
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

  _initFocus() {
    if (!this._map.getSource(FOCUS_SOURCE_NAME)) {
      this._map.addSource(FOCUS_SOURCE_NAME, {
        type: 'geojson',
        dynamic: true,
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
    }

    if(!this._map.getLayer(FOCUS_LAYER_NAME)) {
      this._map.addLayer(FOCUS_LAYER)
    }
  }
}

export default Plot;
