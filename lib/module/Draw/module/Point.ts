import { LngLatLike, Map, MapMouseEvent, MapMouseEventType } from "mapbox-gl";
import { point } from '@turf/turf'
import Plot from './Plot.ts'
import { v4 as uuidV4 } from 'uuid';
import { Feature, GeoJsonProperties, Position } from "geojson";
import {
  POINT_LAYER,
  POINT_SYMBOL_LAYER,
  POINT_SOURCE_NAME,
  POINT_LAYER_NAME,
  POINT_ICON_LAYER_NAME,
  POINT_INDEX_LAYER_NAME,
  POINT_INDEX_LAYER,
  POINT_INDEX_TEXT_LAYER,
} from "./vars.ts";

interface PointOptions {
  id?: string;
  type: pointType;
  name?: string | number;
  coordinates?: Position;
  immediate?: boolean
  properties?: GeoJsonProperties;
  textStyle?: object;
  circleStyle?: {
    circleRadius?: number,
    circleColor?: string,
    strokeWidth?: number,
    strokeColor?: string
  };
  iconStyle?: {
    icon: string;
    iconSize?: number;
  };
  indexStyle?: {
    textSize?: number,
    textColor?: string,
    circleRadius?: number,
    circleColor?: string,
    strokeWidth?: number,
    strokeColor?: string
  }
}

type pointType = 'circle' | 'icon' | 'index';

type eventType = 'create' | 'update' | 'resident';


type pointEvent = {
  [key in eventType]: Partial<{
    [key in MapMouseEventType]: (e: MapMouseEvent) => void;
  }>
};


class Point extends Plot {

  static SOURCE: string = POINT_SOURCE_NAME

  static EMPTY: string = '-1,-1'

  _options: PointOptions;

  coordinates: Position;

  id: string;

  properties: GeoJsonProperties;

  _event: pointEvent = {
    create: {
      click: (e: MapMouseEvent) => {
        this.coordinates = [e.lngLat.lng, e.lngLat.lat];
        this._render(this.feature);
        this.setCursor('pointer');

        this._createFunc(false);
        this._updateFunc(true);
        this._residentFunc(true);
      }
    },
    update: {
      mousedown: (e: MapMouseEvent) => {
        e.preventDefault();

        this.setCursor('move');
        this._map.on('mousemove', this._event.update.mousemove!)
        this._map.once('mouseup', this._event.update.mouseup!)
      },
      mousemove: (e: MapMouseEvent) => {
        this.update([e.lngLat.lng, e.lngLat.lat])
        this.setCursor('move');
      },
      mouseup: () => {
        this.setCursor('pointer');
        this._map.off('mousemove', this._event.update.mousemove!)
      }
    },
    resident: {
      mouseenter: () => {
        this.setCursor('pointer');
      },
      mouseleave: () => {
        this.setCursor('');
      },
      click: (e: MapMouseEvent) => {
        console.log(e.features, 'eeeeeeee');
        this.select()
      }
    }
  }

  constructor(map: Map, options: PointOptions) {
    super(map, Point.SOURCE, [POINT_LAYER, POINT_SYMBOL_LAYER, POINT_INDEX_LAYER, POINT_INDEX_TEXT_LAYER]);
    this._options = options;
    this.id = this._options.id || uuidV4();
    this.properties = this._options.properties || {};
    this.coordinates = this._options.coordinates || [-1, -1];

    if (this.coordinates.toString() === Point.EMPTY) {
      this._options.immediate && this.start();
    } else {
      this._render(this.feature);
      this._updateFunc(true);
      this._residentFunc(true);
    }
  }

  get meta() {
    return this._options.type
  }

  get feature(): Feature {
    let props: GeoJsonProperties = {
      meta: this.meta,
    }

    if (this.meta === 'circle') {
      props = {
        ...props,
        ...this._options.circleStyle,
        name: this._options.name
      }
    } else if (this.meta === 'icon') {
      props.icon = this._options.iconStyle?.icon
    } else if (this.meta === 'index') {
      props = {
        ...props,
        ...this._options.indexStyle,
        name: this._options.name
      }
    }

    return point(this.coordinates, { ...this.properties, ...props }, {
      id: this.id,
    })
  }

  get layer() {
    const metaMap = {
      'circle': POINT_LAYER_NAME,
      'icon': POINT_ICON_LAYER_NAME,
      'index': POINT_INDEX_LAYER_NAME,
    }

    return metaMap[this.meta];
  }

  start() {
    this.setCursor('crosshair');
    this._createFunc(true)
  }

  update(value: Position) {
    this.move(value);
    this.emit('update', this.feature)
  }

  move(value: Position): void {
    this.coordinates = value;

    this._render(this.feature);
    this.emit('move', this.feature)
  }

  position(): void {
    const zoom = this._map.getZoom();
    this._map.flyTo({
      center: this.coordinates as LngLatLike,
      zoom: zoom <= 12 ? 12 : zoom,
    })
  }

  select() {
    this.setCheck(true)
  }

  unselect() {
    this.setCheck(false)
  }

  focus() {}

  _createFunc(value: boolean) {
    this._map[value ? 'on' : 'off']('click', this._event.create.click!)
  }

  _updateFunc(value: boolean) {
    this._map[value ? 'on' : 'off']('mousedown', this.layer, this._event.update.mousedown!)
  }

  _residentFunc(value: boolean) {
    this._map[value ? 'on' : 'off']('mouseenter', this.layer, this._event.resident.mouseenter!)
    this._map[value ? 'on' : 'off']('mouseleave', this.layer, this._event.resident.mouseleave!)
    this._map[value ? 'on' : 'off']('click', this.layer, this._event.resident.click!)
  }
}

export default Point;
