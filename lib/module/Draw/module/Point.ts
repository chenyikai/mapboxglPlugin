import { LngLatBoundsLike, LngLatLike, Map, MapMouseEvent } from "mapbox-gl";
import { point } from "@turf/turf";
import Plot from './Plot.ts'
import { v4 as uuidV4 } from 'uuid';
import { Feature, GeoJsonProperties } from "geojson";
import * as VARS from "./vars.ts";
import { plotEvent, PlotEventKey, PointCoordinates } from "types/module/Draw/Plot.ts";
import { PointOptions, pointType } from 'types/module/Draw/Point.ts'
import { getPointScope, focus, unFocus } from "lib/utils/util.ts";


class Point extends Plot {

  static EMPTY: string = '-1,-1'

  static EMD: string = 'point-end'

  _options: PointOptions;

  coordinates: PointCoordinates;

  id: string;

  properties: GeoJsonProperties;

  _event: plotEvent = {
    focus: {
      zoomend: () => {
        if (this.checkId) {
          const { bbox, width } = this.focusParams;
          focus(this._map, {
            id: this.checkId,
            bbox,
            width
          })
        }
      },
    },
    create: {
      click: (e: MapMouseEvent) => {
        this.coordinates = [e.lngLat.lng, e.lngLat.lat];
        this.refresh();
        this.setCursor(VARS.CLICK_CURSOR);

        this._createFunc(false);
        this._residentFunc(true);
      }
    },
    update: {
      mousedown: (e: MapMouseEvent) => {
        e.preventDefault();
        if (this.isSelfUnderMouse(e)) {
          this.setCursor(VARS.MOVE_CURSOR);

          this._map.on('mousemove', this._event.update.mousemove!)
          this._map.once('mouseup', this._event.update.mouseup!)
        }
      },
      mousemove: (e: MapMouseEvent) => {
        this.setCursor(VARS.MOVE_CURSOR);

        this.update([e.lngLat.lng, e.lngLat.lat])
      },
      mouseup: (e: MapMouseEvent) => {
        this.setCursor(VARS.CLICK_CURSOR);

        this._map.off('mousemove', this._event.update.mousemove!)

        const features = this._map.queryRenderedFeatures(e.point, {
          target: {
            layerId: this.layer
          }
        });
        if (!features.some(item => this.isSelf(item))) {
          this._updateFunc(false)
        }
      }
    },
    resident: {
      mouseenter: (e: MapMouseEvent) => {
        if (VARS.NO_MOUSE_RESPONSE_CURSOR.includes(this.getCursor())) return;

        if (this.isSelfUnderMouse(e)) {
          this.hover(this.feature);
          this.refresh();
          this.emit(VARS.HOVER_EMIT, this.feature)

          this._updateFunc(true)
        }
      },
      mouseleave: () => {
        if (VARS.NO_MOUSE_RESPONSE_CURSOR.includes(this.getCursor())) return;

        if (this.hoverFeature) {
          this.unHover();
          this.refresh();
          this.emit(VARS.HOVER_END_EMIT, this.feature)

          this._updateFunc(false)
        }
      },
      click: (e: MapMouseEvent) => {
        if (VARS.NO_MOUSE_RESPONSE_CURSOR.includes(this.getCursor())) return;

        if (e.features?.length) {
          const feature = e.features[0]
          if (this.isSelf(feature)) {
            this.select();
            this.emit(VARS.CLICK_EMIT, feature);
          }
        }
      },
      zoomend: () => {
        if (this.checkId) {
          const { bbox, width } = this.focusParams;
          focus(this._map, {
            id: this.checkId,
            bbox,
            width
          })
        }
      },
    }
  }

  constructor(map: Map, options: PointOptions) {
    super(map, VARS.POINT_SOURCE_NAME, VARS.POINT_LAYERS);
    this._options = options;
    this.id = this._options.id || uuidV4();
    this.properties = this._options.properties || {};
    this.coordinates = this._options.coordinates || [-1, -1];

    if (this.coordinates.toString() === Point.EMPTY) {
      this._options.immediate && this.start();
    } else {
      this.refresh();
      this._residentFunc(true);
    }
  }


  get activeStyle(): GeoJsonProperties {
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

  get style() {
    let props: GeoJsonProperties = {
      name: this._options.name,
      meta: this.meta,
      hover: this.isHover,
      source: this.source,
      ...this.isHover ? this.activeStyle : {},
      ...this.isCheck ? this.activeStyle : {},
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

    return { ...this.properties, ...props }
  }

  get feature(): Feature {
    return point(this.coordinates, { ...this.style, id: this.id }, {
      id: this.id,
    })
  }

  get layer() {
    const anchor = this._options.iconStyle?.anchor || 'center';

    const metaMap = {
      'circle': VARS.POINT_CIRCLE_LAYER_NAME,
      'icon': `${VARS.POINT_ICON_LAYER_NAME}-${anchor}`,
      'index': VARS.POINT_INDEX_LAYER_NAME,
    }

    return metaMap[this.meta];
  }

  get focusParams() {
    const {x, y} = this._map.project(this.coordinates)
    let bbox: LngLatBoundsLike = [0, 0, 0, 0];
    let width: number = 20;

    if (this.meta === 'circle') {
      const radius = this._options.circleStyle?.circleRadius || VARS.DEFAULT_CIRCLE_RADIUS;
      const stroke_width = this._options.circleStyle?.strokeWidth || VARS.DEFAULT_CIRCLE_STROKE_WIDTH;

      width = radius + stroke_width * 2 + VARS.FOCUS_PADDING * 2;
      bbox = getPointScope(this._map, x, y, width)

    } else if (this.meta === 'index') {
      const radius = this._options.indexStyle?.circleRadius || VARS.DEFAULT_CIRCLE_RADIUS;
      const stroke_width = this._options.indexStyle?.strokeWidth || VARS.DEFAULT_CIRCLE_STROKE_WIDTH;

      width = radius + stroke_width * 2 + VARS.FOCUS_PADDING * 2;
      bbox = getPointScope(this._map, x, y, width)
    } else if (this.meta === 'icon') {
      const size: number = this._options.iconStyle?.iconSize || VARS.defaultIconSize;

      // todo 获取实际图片大小后续改为
      width = 48 * size + VARS.FOCUS_PADDING * 2;
      bbox = getPointScope(this._map, x, y, width)
    } else {
      throw new Error(`Unknown feature type ${this.meta}`);
    }

    return { bbox, width }
  }

  start() {
    this._residentFunc(false);
    this._createFunc(true);
    this.setCursor(VARS.CREATE_CURSOR);
  }

  update(value: [number, number]) {
    this.move(value);
    this.emit('update', this.feature);
    this._map.fire(VARS.EVENTS.POINT_UPDATE, this.feature);

    if (this.checkId) {
      const { bbox, width } = this.focusParams;
      focus(this._map, {
        id: this.checkId,
        bbox,
        width
      })
    }
  }

  remove() {
    this._createFunc(false);
    this._updateFunc(false);
    this._residentFunc(false);
  }

  move(value: [number, number]): void {
    this.coordinates = value;

    this.refresh();
    this.emit('move', this.feature)
    this._map.fire(VARS.EVENTS.POINT_MOVE, this.feature);
  }

  position(): void {
    const zoom = this._map.getZoom();
    this._map.flyTo({
      center: this.coordinates as LngLatLike,
      zoom: zoom <= 12 ? 12 : zoom,
    })
  }

  select() {
    this.focus();
    this.position();
    this.refresh();
  }

  unSelect() {
    this.unFocus();
    this.refresh();
  }

  focus() {
    const { bbox, width } = this.focusParams;
    const id = focus(this._map, { bbox, width});
    this.check(id);
    this.refresh();
  }

  unFocus() {
    unFocus(this._map, this.checkId)
    this.unCheck();
    this.refresh();
  }

  refresh() {
    this._render(this.feature)
  }

  _createFunc(value: boolean, key?: PlotEventKey) {
    if (key) {
      console.log('开启key');
      return;
    }
    this._map[value ? 'on' : 'off']('click', this._event.create.click!)
  }

  _updateFunc(value: boolean, key?: PlotEventKey) {
    if (key) {
      console.log('开启key');
      return;
    }
    this._map[value ? 'on' : 'off']('mousedown', this.layer, this._event.update.mousedown!)
  }

  _residentFunc(value: boolean, key?: PlotEventKey) {
    if (key) {
      console.log('开启key');
      return;
    }
    this._map[value ? 'on' : 'off']('mouseenter', this.layer, this._event.resident.mouseenter!)
    this._map[value ? 'on' : 'off']('mouseleave', this.layer, this._event.resident.mouseleave!)
    this._map[value ? 'on' : 'off']('click', this.layer, this._event.resident.click!)
    this._map[value ? 'on' : 'off']('zoomend', this.layer, this._event.resident.zoomend!)
  }
}

export default Point;
