import type { LayerSpecification } from "mapbox-gl";
import { LAYER_ENUM } from 'types/module/Layer'

export const OUTLINE_LAYER: LayerSpecification = {
  id: LAYER_ENUM.OUTLINE_LAYER_NAME,
  source: LAYER_ENUM.SOURCE,
  type: "line",
  filter: ["has", "outline"],
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-color": ["get", "outline"],
    "line-width": [
      "case",
      ['has', 'outline-width'],
      ['get', 'outline-width'],
      3
    ]
  }
}

export const FILL_LAYER: LayerSpecification = {
  id: LAYER_ENUM.POLYGON_LAYER_NAME,
  source: LAYER_ENUM.SOURCE,
  type: "fill",
  filter: ["==", "$type", "Polygon"],
  layout: {
    "fill-sort-key": ["get", "sort"],
  },
  paint: {
    "fill-color": ["get", "background-color"],
    "fill-opacity": ["get", "opacity"],
  },
}

export const LINE_LAYER: LayerSpecification = {
  id: LAYER_ENUM.LINE_LAYER_NAME,
  source: LAYER_ENUM.SOURCE,
  type: "line",
  filter: [
    "all",
    ["==", "$type", "LineString"],
    ["!has", "outline"],
    ["!=", "meta", "title"],
    ["!=", "meta", "route-line"],
  ],
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-color": ["get", "background-color"],
    // 'line-width': ['get', 'line-width'],
    // 'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0, 19, ['get', 'line-width']],
    "line-width": ["case", ["has", "line-width"], ["get", "line-width"], 3],
    "line-opacity": ["get", "opacity"],
    "line-gap-width": [
      "case",
      ["to-boolean", "line-gap-width"],
      ["get", "line-gap-width"],
      0,
    ],
  },
}

export const POINT_LAYER: LayerSpecification = {
  id: LAYER_ENUM.POINT_LAYER_NAME,
  source: LAYER_ENUM.SOURCE,
  type: "symbol",
  filter: ["all", ["==", "$type", "Point"]],
  layout: {
    // 'icon-allow-overlap': true,
    "icon-anchor": "bottom",
    "icon-image": ["get", "icon"],
    // 'icon-size': ['case', ['has', 'icon-size'], ['get', 'icon-size'], 1],
    "icon-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      0.3,
      19,
      ["coalesce", ["get", "icon-size"], 1],
    ],
  },
  paint: {},
}

export const TEXT_LAYER: LayerSpecification = {
  id: LAYER_ENUM.TEXT_LAYER_NAME,
  source: LAYER_ENUM.SOURCE,
  type: "symbol",
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "title"]],
  minzoom: 8,
  maxzoom: 24,
  layout: {
    "icon-anchor": "bottom",
    "icon-image": ["get", "icon"],
    "icon-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      0.3,
      19,
      ["coalesce", ["get", "icon-size"], 1],
    ],
    "text-field": ["get", "name"],
    // TODO 尚有问题
    // 'text-offset': ['literal', [0, ['+', ['*', ['floor', ['/', ['length', ['get', 'name']], 10]], 0.5], 1]]],
    "text-offset": ["get", "text-offset"],
    "text-size": 14,
    // 'text-size': ['interpolate', ['linear'], ['zoom'], 10, 0.01, 14, 14],
  },
  paint: {
    "text-halo-color": "#fff",
    "text-halo-width": 1,
  },
}

export const LINE_TEXT_LAYER: LayerSpecification = {
  id: LAYER_ENUM.LINE_TEXT_LAYER_NAME,
  source: LAYER_ENUM.SOURCE,
  type: "symbol",
  filter: ["all", ["==", "$type", "LineString"], ["==", "meta", "title"]],
  minzoom: 8,
  maxzoom: 24,
  layout: {
    "text-field": ["get", "name"],
    // 'text-allow-overlap': true,
    "symbol-placement": "line-center",
    "text-offset": [0, 1],
    "icon-ignore-placement": true,
    "text-ignore-placement": false,
    "text-letter-spacing": 0.01,
    "text-size": 14,
  },
  paint: {
    "text-halo-color": "#fff",
    "text-halo-width": 1,
  },
}

export const layerList = [
  OUTLINE_LAYER,
  FILL_LAYER,
  LINE_LAYER,
  POINT_LAYER,
  TEXT_LAYER,
  LINE_TEXT_LAYER
]
