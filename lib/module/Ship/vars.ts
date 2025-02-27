import { LayerSpecification } from 'mapbox-gl'

export const SHIP_SOURCE_NAME = 'mapbox-gl-ship-source'

export const SHIP_ICON_LAYER_NAME = 'mapbox-gl-ship-icon-layer'

export const SHIP_REAL_LAYER_NAME = 'mapbox-gl-ship-real-layer'

export const SHIP_ICON_LAYER: LayerSpecification = {
  id: SHIP_ICON_LAYER_NAME,
  source: SHIP_SOURCE_NAME,
  type: 'symbol'
}

export const SHIP_REAL_LAYER: LayerSpecification = {
  id: SHIP_REAL_LAYER_NAME,
  source: SHIP_SOURCE_NAME,
  type: 'fill',
  layout: {},
  paint: {
    "fill-color": 'rgba(153,153,153,0.8)',
    // "fill-outline-color": '#000'
  }
}
