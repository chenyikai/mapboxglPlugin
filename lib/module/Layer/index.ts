import EventEmitter from 'eventemitter3'
import { cloneDeep, set } from "lodash-es";
import type { Map, GeoJSONSource } from 'mapbox-gl'
import { layerOptions, GraphicParameter, customAttr } from "types/module/Layer";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { parse } from "wellknown";
import { feature, bbox } from "@turf/turf";
import type { AllGeoJSON } from '@turf/turf'
import { LAYER_ENUM, LayerGeoJsonProperties } from 'types/module/Layer'
import Icon from 'lib/core/Icon'
import { layerList } from "lib/module/Layer/vars.ts";
import { isNull } from "lib/utils/validate.ts";

class Layer extends EventEmitter {
  _map: Map;
  iconManage: Icon | undefined;
  options: layerOptions | undefined;
  features: { [id: string]: Feature<Geometry, LayerGeoJsonProperties> };

  static SOURCE: LAYER_ENUM = LAYER_ENUM.SOURCE;

  static DIVIDER: string = 'layer-end'

  constructor(map: Map, options?: layerOptions) {
    super();

    this._map = map;
    this.options = options;
    this.iconManage = new Icon(this._map)
    this.features = {}

    this._addIcons()
    this._addLayers()
  }

  get _collection(): FeatureCollection {
    return {
      type: "FeatureCollection",
      features: Object.values(this.features)
    }
  }

  get source(): GeoJSONSource | undefined {
    return this._map.getSource(Layer.SOURCE)
  }

  _addIcons(): void {
    if (Array.isArray(this.options?.icons) && this.options.icons.length > 0 && this.iconManage) {
      this.iconManage.load(this.options.icons).then(({ error }) => {
        error.forEach((e) => {
          console.error(e.msg);
        })
      })
    }
  }

  _removeIcons() {
    if (Array.isArray(this.options?.icons) && this.options.icons.length > 0 && this.iconManage) {
      this.options.icons.forEach(icon => {
        this.iconManage!.delete(icon.name)
      })
    }
  }

  _addLayers() {
    if (!this.hasSource(Layer.SOURCE)) {
      this._map.addSource(Layer.SOURCE, {
        type: 'geojson',
        data: this._collection
      })
    }

    layerList.forEach(layer => {
      if (!this.hasLayer(layer.id)) {
        this._map.addLayer(layer, Layer.DIVIDER)
      }
    })
  }

  _removeLayers() {
    layerList.forEach(layer => {
      if (this.hasLayer(layer.id)) {
        this._map.removeLayer(layer.id)
      }
    })

    if (this.hasSource(Layer.SOURCE)) {
      this._map.removeSource(Layer.SOURCE)
    }
  }

  hasSource(id: string) {
    return !isNull(this._map.getSource(id))
  }

  hasLayer(id: string) {
    return !isNull(this._map.getLayer(id))
  }

  destroy() {
    this._removeLayers()
    this._removeIcons()
  }

  setFeatureProperties(id: string, key: customAttr & unknown, value: unknown) {
    if (!this.has(id)) {
      console.error(`Cannot set feature properties for ${id}, Because it was not found.`);
      return;
    }

    set(this.features[id].properties, key, value)
    this.render()
  }

  show(id: string): void {
    this.setFeatureProperties(id, 'visible', true)
  }

  hide(id: string): void {
    this.setFeatureProperties(id, 'visible', false)
  }

  focus(id: string): void {
    console.log(id, 'id');
  }

  add(graphic: Array<GraphicParameter> | GraphicParameter): Feature | Array<Feature> {
    let features: Feature | Array<Feature> = []
    if (Array.isArray(graphic)) {
      features = graphic.map(item => this._createFeature(item))
    } else {
      features = this._createFeature(graphic)
    }

    this.render()
    return features
  }

  update(graphic: GraphicParameter) {
    if (!this.has(graphic.id)) {
      console.error(`Cannot update layer with id ${graphic.id}, Because it was not found.`);
      return;
    }
    this._createFeature(graphic)
    this.render()
  }

  delete(id: string): Feature {
    const graphic: Feature = cloneDeep(this.features[id])
    delete this.features[id]

    this.render()
    return graphic
  }

  get(id: string): Feature {
    return this.features[id];
  }

  deleteAll(): void {
    this.features = {}
    this.render()
  }

  has(id: string): boolean {
    const _feature = this.get(id)
    return !isNull(_feature)
  }

  render(): void {
    if (this._collection.features.length === 0 && this.source) {
      this.source.setData(this._collection)
    }
  }

  _createFeature({ id, coordinates, properties }: GraphicParameter): Feature {
    const _geometry = parse(coordinates)
    const _feature = feature(_geometry, {
      visible: true,
      ...properties,
    }, {
      id,
      bbox: bbox(_geometry as AllGeoJSON)
    })

    id && set(this.features, id, _feature)
    return _feature
  }
}

export default Layer
