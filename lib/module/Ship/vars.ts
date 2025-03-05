import { LayerSpecification } from 'mapbox-gl'

export const SHIP_SOURCE_NAME = 'mapbox-gl-ship-source'

export const SHIP_ICON_LAYER_NAME = 'mapbox-gl-ship-icon-layer'

export const SHIP_REAL_LAYER_NAME = 'mapbox-gl-ship-real-layer'

export const SHIP_REAL_OUTLINE_LAYER_NAME = 'mapbox-gl-ship-real-outline-layer'

export const SHIP_REAL_CONNECT_LINE_LAYER_NAME = 'mapbox-gl-ship-connect-line-layer'

export const SHIP_ICON_LAYER: LayerSpecification = {
  id: SHIP_ICON_LAYER_NAME,
  source: SHIP_SOURCE_NAME,
  type: 'symbol',
  layout: {
    "icon-allow-overlap": true,
    "icon-image": ['get', 'icon'],
    "icon-rotate": ['get', 'dir'],
    'icon-size': ['interpolate', ['linear'], ['zoom'], 0, 0.2, 19, 0.5],
  }
}

export const SHIP_REAL_LAYER: LayerSpecification = {
  id: SHIP_REAL_LAYER_NAME,
  source: SHIP_SOURCE_NAME,
  type: 'fill',
  layout: {},
  paint: {
    "fill-color": '#0f0',
  }
}

export const SHIP_REAL_OUTLINE_LAYER: LayerSpecification = {
  id: SHIP_REAL_OUTLINE_LAYER_NAME,
  source: SHIP_SOURCE_NAME,
  type: 'line',
  layout: {},
  paint: {
    "line-color": '#000',
    "line-width": 2
  }
}

export const SHIP_REAL_CONNECT_LINE_LAYER: LayerSpecification = {
  id: SHIP_REAL_CONNECT_LINE_LAYER_NAME,
  source: SHIP_SOURCE_NAME,
  type: 'line',
  layout: {
  },
  paint: {
    "line-color": '#fff',
    "line-width": 2,
    "line-opacity": 0.5
  }
}
