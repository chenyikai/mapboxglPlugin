import { DataDrivenPropertyValueSpecification, LayerSpecification } from 'mapbox-gl'

/** ------------------------------------------------ 公用变量 --------------------------------------------------------**/

export const COLD: string = 'cold';

export const HOT: string = 'hot';

export const DIRECTION = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
}

/** ------------------------------------------------ 点类变量 --------------------------------------------------------**/

export const CIRCLE = 'circle';

export const ICON = 'icon';

export const INDEX = 'index';

export const POINT_LAYER_NAME = 'plot-point-layer'

export const POINT_ICON_LAYER_NAME = 'plot-symbol-point-layer'

export const POINT_INDEX_LAYER_NAME = 'plot-index-point-layer'

export const POINT_INDEX_TEXT_LAYER_NAME = 'plot-index-text-point-layer'

export const POINT_SOURCE_NAME = 'plot-point'

/**
 * circle图层
 */
export const POINT_LAYER: LayerSpecification = {
  id: POINT_LAYER_NAME,
  type: "circle",
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "circle"]],
  source: POINT_SOURCE_NAME,
  paint: {
    'circle-radius': ['case', ['has', 'circleRadius'], ['get', 'circleRadius'], 8],
    'circle-color': ['case', ['has', 'circleColor'], ['get', 'circleColor'], "#fff"],
    "circle-stroke-width": ['case', ['has', 'strokeWidth'], ['get', 'strokeWidth'], 2],
    "circle-stroke-color": ['case', ['has', 'strokeColor'], ['get', 'strokeColor'], "#4093ff"],
  },
}

/**
 * icon图层
 */

const iconAllowOverlap = true;
const iconImage: DataDrivenPropertyValueSpecification<string> = ["get", "icon"];
const iconSize = 1;
const filter = ["all", ["==", "$type", "Point"], ["==", "meta", "icon"]]

export const POINT_SYMBOL_CENTER_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.CENTER}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "center"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "center",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_LEFT_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.LEFT}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "left"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "left",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_RIGHT_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.RIGHT}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "right"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "right",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_TOP_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.TOP}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "top"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "top",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_BOTTOM_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.BOTTOM}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "bottom"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "bottom",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_TOP_LEFT_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.TOP_LEFT}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "top-left"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "top-left",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_TOP_RIGHT_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.TOP_RIGHT}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "top-right"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "top-right",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_BOTTOM_LEFT_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.BOTTOM_LEFT}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "bottom-left"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "bottom-left",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_SYMBOL_BOTTOM_RIGHT_LAYER: LayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.BOTTOM_RIGHT}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "bottom-right"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "bottom-right",
    "icon-image": iconImage,
    "icon-size": iconSize
  },
  paint: {}
}

export const POINT_INDEX_LAYER: LayerSpecification = {
  id: POINT_INDEX_LAYER_NAME,
  type: "circle",
  source: POINT_SOURCE_NAME,
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "index"]],
  paint: {
    'circle-radius': ['case', ['has', 'circleRadius'], ['get', 'circleRadius'], 8],
    'circle-color': ['case', ['has', 'circleColor'], ['get', 'circleColor'], "#fff"],
    "circle-stroke-width": ['case', ['has', 'strokeWidth'], ['get', 'strokeWidth'], 2],
    "circle-stroke-color": ['case', ['has', 'strokeColor'], ['get', 'strokeColor'], "#4093ff"],
  },
  layout: {},
}

export const POINT_INDEX_TEXT_LAYER: LayerSpecification = {
  id: POINT_INDEX_TEXT_LAYER_NAME,
  type: 'symbol',
  source: POINT_SOURCE_NAME,
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "index"]],
  paint: {
    'text-color': ['case', ['has', 'textColor'], ['get', 'textColor'], "#4093ff"],
  },
  layout: {
    'text-field': ['get', 'name'],
    "text-font":["Open Sans Regular", "Arial Unicode MS Regular"],
    'text-anchor': 'center',
    'text-size': ['case', ['has', 'textSize'], ['get', 'textSize'], 12],
    'text-allow-overlap': true
  },
};

/** ------------------------------------------------ 线类变量 --------------------------------------------------------**/

export const LINE_STRING_SOURCE_NAME = 'plot-lineString'

export const LINE_STRING_LAYER_NAME = 'plot-lineString-layer'

export const LINE_STRING_LAYER: LayerSpecification = {
  id: LINE_STRING_LAYER_NAME,
  type: "line",
  source: LINE_STRING_SOURCE_NAME,
  filter: ["all", ["==", "$type", "LineString"]],
  paint: {
    "line-color": "#4093ff",
    "line-width": 3,
  },
  layout: {},
}

export const EVENTS = {
  POINT_MOVE: 'point.move',
  POINT_UPDATE: 'point.update'
}
