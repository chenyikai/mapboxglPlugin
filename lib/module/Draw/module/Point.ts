import { LngLatLike, Map, MapMouseEvent } from "mapbox-gl";
import { point } from "@turf/turf";
import Plot from './Plot.ts'
import { v4 as uuidV4 } from 'uuid';
import { Feature, GeoJsonProperties, Position } from "geojson";
import {
  COLD,
  HOT,
  POINT_LAYER,
  POINT_SOURCE_NAME,
  POINT_LAYER_NAME,
  POINT_ICON_LAYER_NAME,
  POINT_INDEX_LAYER_NAME,
  POINT_INDEX_LAYER,
  POINT_INDEX_TEXT_LAYER,
  EVENTS,
  POINT_SYMBOL_CENTER_LAYER,
  POINT_SYMBOL_LEFT_LAYER,
  POINT_SYMBOL_RIGHT_LAYER,
  POINT_SYMBOL_TOP_LAYER,
  POINT_SYMBOL_BOTTOM_LAYER,
  POINT_SYMBOL_TOP_LEFT_LAYER,
  POINT_SYMBOL_TOP_RIGHT_LAYER,
  POINT_SYMBOL_BOTTOM_LEFT_LAYER,
  POINT_SYMBOL_BOTTOM_RIGHT_LAYER,
  CREATE_CURSOR,
  CLICK_CURSOR,
  MOVE_CURSOR,
  HOVER_END_EMIT,
  CLICK_EMIT,
  HOVER_EMIT, NO_MOUSE_RESPONSE_CURSOR,
} from "./vars.ts";
import { plotEvent } from "types/module/Draw/plot.ts";
import { PointOptions, pointType } from 'types/module/Draw/Point.ts'


class Point extends Plot {

  static EMPTY: string = '-1,-1'

  _options: PointOptions;

  coordinates: Position;

  id: string;

  properties: GeoJsonProperties;

  _event: plotEvent = {
    create: {
      click: (e: MapMouseEvent) => {
        this.coordinates = [e.lngLat.lng, e.lngLat.lat];
        this._render(this.feature);
        this.setCursor(CLICK_CURSOR);

        this._createFunc(false);
        this._residentFunc(true);
      }
    },
    update: {
      mousedown: (e: MapMouseEvent) => {
        e.preventDefault();
        if (this.isSelfUnderMouse(e)) {
          this.setCursor(MOVE_CURSOR);

          this._map.on('mousemove', this._event.update.mousemove!)
          this._map.once('mouseup', this._event.update.mouseup!)
        }
      },
      mousemove: (e: MapMouseEvent) => {
        this.setCursor(MOVE_CURSOR);

        this.update([e.lngLat.lng, e.lngLat.lat])
      },
      mouseup: (e: MapMouseEvent) => {
        this.setCursor(CLICK_CURSOR);

        this._map.off('mousemove', this._event.update.mousemove!)

        const features = this._map.queryRenderedFeatures(e.point, {
          target: {
            layerId: this.layer[COLD]
          }
        });
        if (!features.some(item => this.isSelf(item))) {
          this._updateFunc(false)
        }
      }
    },
    resident: {
      mouseenter: (e: MapMouseEvent) => {
        if (NO_MOUSE_RESPONSE_CURSOR.includes(this.getCursor())) return;

        if (this.isSelfUnderMouse(e)) {
          this.hover(this.feature);
          this._render(this.feature);
          this.emit(HOVER_EMIT, this.feature)

          this._updateFunc(true)
        }
      },
      mouseleave: () => {
        if (NO_MOUSE_RESPONSE_CURSOR.includes(this.getCursor())) return;

        if (this.hoverFeature) {
          this.unHover();
          this._render(this.feature);
          this.emit(HOVER_END_EMIT, this.feature)

          this._updateFunc(false)
        }
      },
      click: (e: MapMouseEvent) => {
        if (NO_MOUSE_RESPONSE_CURSOR.includes(this.getCursor())) return;

        if (e.features?.length) {
          const feature = e.features[0]
          if (this.isSelf(feature)) {
            this.emit(CLICK_EMIT, feature);
          }
        }
      },
    }
  }

  constructor(map: Map, options: PointOptions) {
    super(map, POINT_SOURCE_NAME, [
      POINT_LAYER,
      POINT_INDEX_LAYER,
      POINT_INDEX_TEXT_LAYER,
      POINT_SYMBOL_CENTER_LAYER,
      POINT_SYMBOL_LEFT_LAYER,
      POINT_SYMBOL_RIGHT_LAYER,
      POINT_SYMBOL_TOP_LAYER,
      POINT_SYMBOL_BOTTOM_LAYER,
      POINT_SYMBOL_TOP_LEFT_LAYER,
      POINT_SYMBOL_TOP_RIGHT_LAYER,
      POINT_SYMBOL_BOTTOM_LEFT_LAYER,
      POINT_SYMBOL_BOTTOM_RIGHT_LAYER
    ]);
    this._options = options;
    this.id = this._options.id || uuidV4();
    this.properties = this._options.properties || {};
    this.coordinates = this._options.coordinates || [-1, -1];

    if (this.coordinates.toString() === Point.EMPTY) {
      this._options.immediate && this.start();
    } else {
      this._render(this.feature);
      this._residentFunc(true);
    }
  }


  get hoverStyle(): GeoJsonProperties {
    const styleMap = {
      'circle': {
        strokeColor: '#f00',
      },
      'icon': {},
      'index': {
        strokeColor: '#f00',
        textColor: '#f00'
      },
    }

    return styleMap[this.meta];
  }

  get meta(): pointType {
    return this._options.type
  }

  get feature(): Feature {
    let props: GeoJsonProperties = {
      name: this._options.name,
      meta: this.meta,
      hover: this.isHover,
      source: this.source,
      ...this.isHover ? this.hoverStyle : {},
    }

    switch (this.meta) {
      case "circle":
        props = {
          ...props,
          ...this._options.circleStyle,
        }
        break;
      case "icon":
        props = {
          ...props,
          ...this._options.iconStyle,
          anchor: this._options.iconStyle?.anchor || 'center',
          icon: this._options.iconStyle?.icon,
        }
        break;
      case "index":
        props = {
          ...props,
          ...this._options.indexStyle,
        }
        break;
      default:
        throw new Error(`Unknown feature type ${this.meta}`);
    }

    return point(this.coordinates, { ...this.properties, ...props, id: this.id }, {
      id: this.id,
    })
  }

  get layer() {
    const anchor = this._options.iconStyle?.anchor || 'center';

    const metaMap = {
      'circle': {
        [HOT]: `${POINT_LAYER_NAME}-${HOT}`,
        [COLD]: `${POINT_LAYER_NAME}-${COLD}`,
      },
      'icon': {
        [HOT]: `${POINT_ICON_LAYER_NAME}-${anchor}-${HOT}`,
        [COLD]: `${POINT_ICON_LAYER_NAME}-${anchor}-${COLD}`
      },
      'index': {
        [HOT]: `${POINT_INDEX_LAYER_NAME}-${HOT}`,
        [COLD]: `${POINT_INDEX_LAYER_NAME}-${COLD}`,
      },
    }

    return metaMap[this.meta];
  }

  start() {
    this._residentFunc(false);
    this._createFunc(true);
    this.setCursor(CREATE_CURSOR);
  }

  update(value: Position) {
    this.move(value);
    this.emit('update', this.feature)
    this._map.fire(EVENTS.POINT_UPDATE, this.feature);
  }

  remove() {
    this._createFunc(false);
    this._updateFunc(false);
    this._residentFunc(false);
  }

  move(value: Position): void {
    this.coordinates = value;

    this._render(this.feature);
    this.emit('move', this.feature)
    this._map.fire(EVENTS.POINT_MOVE, this.feature);
  }

  position(): void {
    const zoom = this._map.getZoom();
    this._map.flyTo({
      center: this.coordinates as LngLatLike,
      zoom: zoom <= 12 ? 12 : zoom,
    })
  }

  select() {
    this._render(this.feature);
  }

  unSelect() {
    this._render(this.feature);
  }

  focus() {
    this.check()
  }

  unFocus() {
    this.unCheck()
  }

  _createFunc(value: boolean) {
    this._map[value ? 'on' : 'off']('click', this._event.create.click!)
  }

  _updateFunc(value: boolean) {
    this._map[value ? 'on' : 'off']('mousedown', this.layer[HOT], this._event.update.mousedown!)
  }

  _residentFunc(value: boolean) {
    this._map[value ? 'on' : 'off']('mouseenter', this.layer[COLD], this._event.resident.mouseenter!)
    this._map[value ? 'on' : 'off']('mouseleave', this.layer[COLD], this._event.resident.mouseleave!)
    this._map[value ? 'on' : 'off']('click', this.layer[COLD], this._event.resident.click!)
  }
}

export default Point;
