import EventEmitter from 'eventemitter3'
import { set } from 'lodash-es'
import type { Map } from 'mapbox-gl'
import type { layerOptions, GraphicParameter } from "types/module/Layer"
import type { Feature, FeatureCollection } from "geojson";
import { parse } from "wellknown";
import { feature, bbox } from "@turf/turf";
import type { AllGeoJSON } from '@turf/turf'

class Layer extends EventEmitter{
  _map: Map;
  options: layerOptions;
  features: { [id: string]: Feature };
  collection: FeatureCollection;

  constructor(map: Map, options: layerOptions) {
    super();

    this._map = map;
    this.options = options;
    this.features = {}
    this.collection = {
      type: "FeatureCollection",
      features: []
    }
  }

  _init(): void {}

  show(): void {}

  hide(val: string): void {
    console.log(val, 'val');
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

    return features
  }

  update(feature: Feature) {
    console.log(feature, 'feature');
  }

  delete(id: string): void {
    console.log(id);
  }

  get(id: string): Feature {
    return this.features[id];
  }

  deleteAll() {}

  render(): void {}

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
