import { LayerSpecification } from "mapbox-gl";

export enum LAYER_ENUM {
  SOURCE = "mapboxgl-layer-source",
  POLYGON_LAYER_NAME = 'mapboxgl-polygon-layer',
  LINE_LAYER_NAME = 'mapbox-line-layer',
  OUTLINE_LAYER_NAME = 'mapbox-outline-layer',
  POINT_LAYER_NAME = 'mapbox-point-layer',
}

const OUTLINE_LAYER: LayerSpecification = {
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

const FILL_LAYER: LayerSpecification = {
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

const LINE_LAYER: LayerSpecification = {
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

export {
  OUTLINE_LAYER,
  FILL_LAYER,
  LINE_LAYER
}
