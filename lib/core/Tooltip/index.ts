import { TooltipOptions } from 'types/core/Toolip/index.ts'
import { Map, Marker, Point, GeoJSONSource, LngLat } from "mapbox-gl";
import { BBox } from 'rbush'
import { addLayer, addSource } from "lib/utils/util.ts";
import { CONNECT_LINE_LAYER, TOOLTIP_SOURCE_NAME } from "lib/core/Tooltip/vars.ts";
import { lineString } from "@turf/turf";
import { Feature, GeoJSON, GeoJsonProperties, LineString } from "geojson";

class Tooltip {

  _map: Map;

  _options: TooltipOptions;

  id: string | number;

  visible: boolean = false;

  mark: Marker | null = null;

  zoomFunc: () => void = this._zoom.bind(this);

  constructor(map: Map, options: TooltipOptions) {
    this._map = map
    this._options = options
    this.id = options.id
    this.visible = !!options.visible

    addSource(this._map, TOOLTIP_SOURCE_NAME, {
      type: 'geojson',
      dynamic: true,
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    addLayer(this._map, CONNECT_LINE_LAYER)

    this._create()
  }

  setAnchor(anchor: TooltipOptions['anchor']) {
    this.remove()
    this._options.anchor = anchor
    this._create()

    this.render()
  }

  getAllBbox() {
    return {
      center: this.getBbox('center'),
      top: this.getBbox('top'),
      bottom: this.getBbox('bottom'),
      left: this.getBbox('left'),
      right: this.getBbox('right'),
      'top-left': this.getBbox('top-left'),
      'top-right': this.getBbox('top-right'),
      'bottom-left': this.getBbox('bottom-left'),
      'bottom-right': this.getBbox('bottom-right'),
    }
  }

  getBbox(val?: TooltipOptions['anchor']): BBox {
    if (this.mark === null) {
      return {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
      }
    }

    const anchor = val ? val : this._options.anchor

    const point = this._map.project(this.mark.getLngLat())
    const offset = this.mark?.getOffset() || new Point(0, 0)
    const { offsetWidth, offsetHeight } = this.mark?.getElement() || { offsetWidth: 0, offsetHeight: 0 }

    const bbox: BBox = {
      minX: point.x,
      minY: point.y,
      maxX: point.x,
      maxY: point.y
    }

    if (anchor === 'top') {
      bbox.minX = point.x - offsetWidth / 2
      bbox.maxX = point.x + offsetWidth / 2
      bbox.maxY = point.y + offsetHeight + Math.abs(offset.y)
    } else if (anchor === 'bottom') {
      bbox.minX = point.x - offsetWidth / 2
      bbox.maxX = point.x + offsetWidth / 2
      bbox.minY = point.y - offsetHeight + offset.y
    } else if (anchor === 'left') {
      bbox.maxY = point.y + offsetHeight / 2
      bbox.minY = point.y - offsetHeight / 2
      bbox.maxX = point.x + offsetWidth + Math.abs(offset.x)
    } else if (anchor === 'right') {
      bbox.maxY = point.y + offsetHeight / 2
      bbox.minY = point.y - offsetHeight / 2
      bbox.minX = point.x - offsetWidth + offset.x
    } else if (anchor === 'center') {
      bbox.maxY = point.y + offsetHeight / 2
      bbox.minY = point.y - offsetHeight / 2
      bbox.maxX = point.x + offsetWidth / 2
      bbox.minX = point.x - offsetWidth / 2
    } else if (anchor === 'top-left') {
      bbox.maxY = point.y + offsetHeight + Math.abs(offset.y)
      bbox.maxX = point.x + offsetWidth + Math.abs(offset.x)
    } else if (anchor === 'top-right') {
      bbox.maxY = point.y + offsetHeight + Math.abs(offset.y)
      bbox.minX = point.x - offsetWidth + offset.x
    } else if (anchor === 'bottom-left') {
      bbox.minY = point.y - offsetHeight + offset.y
      bbox.maxX = point.x + offsetWidth + Math.abs(offset.x)
    } else if (anchor === 'bottom-right') {
      bbox.minY = point.y - offsetHeight + offset.y
      bbox.minX = point.x - offsetWidth + offset.x
    }

    return bbox
  }

  remove() {
    this.mark && this.mark.remove()
    this.mark = null

    this._map.off('zoom', this.zoomFunc)
    this._map.getSource<GeoJSONSource>(TOOLTIP_SOURCE_NAME)?.updateData(<GeoJSON>this.connectLine())
  }

  _create() {
    this.mark = new Marker({
      className: this._options.className || 'mapbox-gl-tooltip',
      element: this._options.element,
      offset: this._getOffsetByAnchor(),
      anchor: this._options.anchor
    }).setLngLat(this._options.position)

    this._map.on('zoom', this.zoomFunc)
  }

  _getOffsetByAnchor() {
    const offset = new Point(0, 0)
    if (this._options.anchor === 'center') {
      offset.x = 0
      offset.y = 0
    } else if (this._options.anchor === 'top') {
      offset.x = 0
      offset.y = this._options.offsetY || 0
    } else if (this._options.anchor === 'bottom') {
      offset.x = 0
      offset.y = -(this._options.offsetY || 0)
    } else if (this._options.anchor === 'left') {
      offset.x = this._options.offsetX || 0
      offset.y = 0
    } else if (this._options.anchor === 'right') {
      offset.x = -(this._options.offsetX || 0)
      offset.y = 0
    } else if (this._options.anchor === 'top-left') {
      offset.x = this._options.offsetX || 0
      offset.y = this._options.offsetY || 0
    } else if (this._options.anchor === 'top-right') {
      offset.x = -(this._options.offsetX || 0)
      offset.y = this._options.offsetY || 0
    } else if (this._options.anchor === 'bottom-left') {
      offset.x = this._options.offsetX || 0
      offset.y = -(this._options.offsetY || 0)
    } else if (this._options.anchor === 'bottom-right') {
      offset.x = -(this._options.offsetX || 0)
      offset.y = -(this._options.offsetY || 0)
    }

    return offset
  }

  setLngLat(lngLat: LngLat) {
    this._options.position = lngLat
    this.mark && this.mark.setLngLat(lngLat)

    return this
  }

  connectLine(): Feature<null, GeoJsonProperties> | Feature<LineString, GeoJsonProperties> {
    const id = `${this._options.id}-tooltip-connect-line`
    const lonLat = this.connectPoint() ? [
      this._options.position.toArray(),
      this.connectPoint()!.toArray()
    ] : null

    if (lonLat === null) {
      const emptyFeature: Feature<null> = {
        id,
        type: 'Feature',
        geometry: null,
        properties: {}
      }
      return emptyFeature
    } else {
      return lineString(lonLat, {}, {
        id
      })
    }
  }

  connectPoint() {
    if (!this.mark) return null

    const point = this._map.project(this.mark.getLngLat())
    const offset = this.mark.getOffset()

    point.x += offset.x
    point.y += offset.y

    if (this._options.anchor === 'top-left') {
      point.x += this.mark.getElement().offsetWidth / 2
    } else if (this._options.anchor === 'top-right') {
      point.x -= this.mark.getElement().offsetWidth / 2
    } else if (this._options.anchor === 'bottom-left') {
      point.x += this.mark.getElement().offsetWidth / 2
    } else if (this._options.anchor === 'bottom-right') {
      point.x -= this.mark.getElement().offsetWidth / 2
    }

    return this._map.unproject(point)
  }

  render() {
    this.mark && this.mark.addTo(this._map)

    this._map.getSource<GeoJSONSource>(TOOLTIP_SOURCE_NAME)?.updateData(<GeoJSON>this.connectLine())
    return this
  }

  _zoom() {
    if (this.visible) {
      this._map.getSource<GeoJSONSource>(TOOLTIP_SOURCE_NAME)?.updateData(<GeoJSON>this.connectLine())
    }
  }
}

export default Tooltip;
