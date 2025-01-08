import { LayerSpecification } from 'mapbox-gl'

export const CIRCLE = 'circle';

export const ICON = 'circle';

export const INDEX = 'circle';

export const POINT_LAYER_NAME = 'plot-point-layer'

export const POINT_ICON_LAYER_NAME = 'plot-symbol-point-layer'

export const POINT_INDEX_LAYER_NAME = 'plot-index-point-layer'

export const POINT_INDEX_TEXT_LAYER_NAME = 'plot-index-text-point-layer'

export const POINT_SOURCE_NAME = 'plot-point'

export const POINT_LAYER: LayerSpecification = {
  id: POINT_LAYER_NAME,
  type: "circle",
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "circle"]],
  source: POINT_SOURCE_NAME,
  paint: {
    'circle-radius': 10,
    'circle-color': '#51bbd6',
  },
}

export const POINT_SYMBOL_LAYER: LayerSpecification = {
  id: POINT_ICON_LAYER_NAME,
  type: "symbol",
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "icon"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": true,
    "icon-anchor": "center",
    "icon-image": ["get", "icon"],
    "icon-size": 1
    // "icon-size": [
    //   "interpolate",
    //   ["linear"],
    //   ["zoom"],
    //   10,
    //   0.01,
    //   19,
    //   ["coalesce", ["get", "icon-size"], 1],
    // ],
  },
  paint: {}
}

export const POINT_INDEX_LAYER: LayerSpecification = {
  id: POINT_INDEX_LAYER_NAME,
  type: "circle",
  source: POINT_SOURCE_NAME,
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "index"]],
  paint: {
    "circle-radius": 8,
    "circle-color": "#fff",
    "circle-stroke-width": 2,
    "circle-stroke-color": "#f00",
  },
  layout: {},
}

export const POINT_INDEX_TEXT_LAYER: LayerSpecification = {
  id: POINT_INDEX_TEXT_LAYER_NAME,
  type: 'symbol',
  source: POINT_SOURCE_NAME,
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "index"]],
  paint: {
    'text-color': 'red',
  },
  layout: {
    'text-field': ['get', 'name'],
    "text-font":["Open Sans Regular", "Arial Unicode MS Regular"],
    'text-anchor': 'center',
    'text-size': 12,
    'text-allow-overlap': true
  },
};
