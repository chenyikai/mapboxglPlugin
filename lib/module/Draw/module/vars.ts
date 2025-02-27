import {
  CircleLayerSpecification,
  DataDrivenPropertyValueSpecification,
  LayerSpecification,
  SymbolLayerSpecification
} from "mapbox-gl";
import { PlotEvent } from 'types/module/Draw/Plot.ts';

/** ------------------------------------------------ 公用变量 --------------------------------------------------------**/

export const COLD: string = 'cold';

export const HOT: string = 'hot';

export const DIVIDER: string = 'plot-end';

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

export const CURSOR = {
  CREATE: 'crosshair',
  CLICK: 'pointer',
  MOVE: 'move',
}

export const EVENTS = {
  POINT_MOVE: 'point.move',
  POINT_UPDATE: 'point.update',
  MOUSE_ENTER: 'mouseenter',
  MOUSE_LEAVE: 'mouseleave',
  CLICK: 'click'
}

// create的cursor
export const CREATE_CURSOR: string = 'crosshair';

export const CLICK_CURSOR: string = 'pointer';

export const MOVE_CURSOR: string = 'move';

export const HOVER_EMIT: PlotEvent = 'hover';

export const HOVER_END_EMIT: PlotEvent = 'hoverend';

export const CLICK_EMIT: PlotEvent = 'click';

// 不响应鼠标事件cursor
export const NO_MOUSE_RESPONSE_CURSOR: Array<string> = [CURSOR.CREATE]

/** ------------------------------------------------ 聚焦图层 --------------------------------------------------------**/

export const FOCUS_SOURCE_NAME: string = 'mapbox-gl-focus-source'

export const FOCUS_LAYER_NAME = 'mapbox-gl-focus-layer'

export const FOCUS_LAYER: LayerSpecification = {
  id: FOCUS_LAYER_NAME,
  type: "line",
  source: FOCUS_SOURCE_NAME,
  paint: {
    "line-color": "#f00",
    "line-width": 3,
  },
  layout: {},
}

/** ------------------------------------------------ 点类变量 --------------------------------------------------------**/

export const CIRCLE = 'circle';

export const ICON = 'icon';

export const INDEX = 'index';

export const FOCUS_PADDING = 10;

export const DEFAULT_CIRCLE_RADIUS: number = 8;

export const DEFAULT_CIRCLE_COLOR: string = '#fff';

export const DEFAULT_CIRCLE_STROKE_WIDTH: number = 2;

export const DEFAULT_CIRCLE_STROKE_COLOR: string = '#4093ff';

export const POINT_CIRCLE_LAYER_NAME = 'plot-point-layer'

export const POINT_ICON_LAYER_NAME = 'plot-symbol-point-layer'

export const POINT_INDEX_LAYER_NAME = 'plot-index-point-layer'

export const POINT_INDEX_TEXT_LAYER_NAME = 'plot-index-text-point-layer'

export const POINT_SOURCE_NAME = 'plot-point'

/**
 * circle图层
 */
export const POINT_LAYER: CircleLayerSpecification = {
  id: POINT_CIRCLE_LAYER_NAME,
  type: "circle",
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "circle"]],
  source: POINT_SOURCE_NAME,
  paint: {
    'circle-radius': ['case', ['has', 'circleRadius'], ['get', 'circleRadius'], DEFAULT_CIRCLE_RADIUS],
    'circle-color': ['case', ['has', 'circleColor'], ['get', 'circleColor'], DEFAULT_CIRCLE_COLOR],
    "circle-stroke-width": ['case', ['has', 'strokeWidth'], ['get', 'strokeWidth'], DEFAULT_CIRCLE_STROKE_WIDTH],
    "circle-stroke-color": ['case', ['has', 'strokeColor'], ['get', 'strokeColor'], DEFAULT_CIRCLE_STROKE_COLOR],
  },
}

export const POINT_CIRCLE_LAYERS: Array<CircleLayerSpecification> = [POINT_LAYER];

/**
 * icon图层
 */

export const iconAllowOverlap: boolean = true;
export const iconImage: DataDrivenPropertyValueSpecification<string> = ["get", "icon"];
export const defaultIconSize = 1;
export const iconSize: DataDrivenPropertyValueSpecification<string> = ['case', ['has', 'iconSize'], ['get', 'iconSize'], defaultIconSize];
export const iconRotate: DataDrivenPropertyValueSpecification<string> = ['case', ['has', 'iconRotate'], ['get', 'iconRotate'], 0];
export const filter = ["all", ["==", "$type", "Point"], ["==", "meta", "icon"]]

export const POINT_SYMBOL_CENTER_LAYER: SymbolLayerSpecification = {
  id: `${POINT_ICON_LAYER_NAME}-${DIRECTION.CENTER}`,
  type: "symbol",
  filter: [...filter, ["==", "anchor", "center"]],
  source: POINT_SOURCE_NAME,
  layout: {
    "icon-allow-overlap": iconAllowOverlap,
    "icon-anchor": "center",
    "icon-image": iconImage,
    "icon-size": iconSize,
    "icon-rotate": iconRotate
  },
  paint: {
  }
}

export const POINT_ICON_LAYERS: Array<SymbolLayerSpecification> = [POINT_SYMBOL_CENTER_LAYER];

export const POINT_INDEX_LAYER: CircleLayerSpecification = {
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
  layout: {
  },
}

export const POINT_INDEX_TEXT_LAYER: SymbolLayerSpecification = {
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

export const POINT_INDEX_LAYERS: Array<LayerSpecification> = [ POINT_INDEX_LAYER, POINT_INDEX_TEXT_LAYER ];

export const POINT_LAYERS: Array<LayerSpecification> = [
  ...POINT_CIRCLE_LAYERS,
  ...POINT_ICON_LAYERS,
  ...POINT_INDEX_LAYERS
];

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

export const LINE_STRING_LAYERS: Array<LayerSpecification> = [
  LINE_STRING_LAYER
]

/** ------------------------------------------------ 通用变量 --------------------------------------------------------**/
