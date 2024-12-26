import type { GeoJsonProperties } from "geojson";
import { icon } from 'types/core/Icon'

export enum LAYER_ENUM {
  SOURCE = "mapboxgl-layer-source",
  POLYGON_LAYER_NAME = 'mapboxgl-polygon-layer',
  LINE_LAYER_NAME = 'mapbox-line-layer',
  OUTLINE_LAYER_NAME = 'mapbox-outline-layer',
  POINT_LAYER_NAME = 'mapbox-layer-point',
  TEXT_LAYER_NAME = 'mapbox-layer-text',
  LINE_TEXT_LAYER_NAME = 'mapbox-layer-line-text',
}

export interface layerOptions {
  icons?: Array<icon>;
}

export type customAttr = 'visible' | 'featureType'

export type LayerGeoJsonProperties = { visible?: boolean, featureType: string } & GeoJsonProperties

/**
 * @param id 唯一标识
 * @param coordinates 地理信息 wkt格式
 * @param properties 基础信息 特殊属性 visible 不传为true 默认展示
 */
export interface GraphicParameter {
  id: string;
  coordinates: string;
  properties: LayerGeoJsonProperties
}
