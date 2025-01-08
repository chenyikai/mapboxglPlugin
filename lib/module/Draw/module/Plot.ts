import EventEmitter from 'eventemitter3'
import type { GeoJSONSource, LayerSpecification, Map } from "mapbox-gl";
import { Feature, Position, GeoJsonProperties } from "geojson";
import { addSource, addLayer } from "lib/utils/util.ts";

abstract class Plot extends EventEmitter {
  _map: Map;
  visible: boolean = true;
  check: boolean = true;
  sourceName: string;

  abstract id: string;
  abstract coordinates: Position;
  abstract properties: GeoJsonProperties;

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

  /**
   * 移动
   * @param value 目标位置
   */
  abstract move(value: Position): void;

  /**
   * 设置选中状态
   * @param value { boolean }
   */
  setCheck(value: boolean) {
    this.check = value;
  }

  /**
   * 设置显隐状态
   * @param value { boolean }
   */
  setVisible(value: boolean) {
    this.visible = value;
  }

  /**
   * 渲染
   */
  _render(features: Array<Feature> | Feature) {
    console.log(features, 'features');
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
}

export default Plot;
