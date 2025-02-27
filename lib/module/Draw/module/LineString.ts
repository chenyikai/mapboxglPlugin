import Plot from "lib/module/Draw/module/Plot.ts";
import { Map, MapMouseEvent } from 'mapbox-gl';
import Point from 'lib/module/Draw/module/Point.ts';
import { plotEvent, PlotEventKey } from "types/module/Draw/Plot.ts";
import { Feature, GeoJsonProperties, Position } from "geojson";
import * as VARS from './vars.ts';
import { v4 as uuidV4 } from 'uuid';
import { lineStringItem, LineStringOptions, lineStringType } from "types/module/Draw/LineString.ts";
import { lineString } from "@turf/turf";

class LineString extends Plot {

  static EMPTY: string = '-1,-1';

  _event: plotEvent = {
    create: {
      click: (e: MapMouseEvent) => {
        const lonLat: lineStringItem = [e.lngLat.lng, e.lngLat.lat];
        this.coordinates.push(lonLat);
        this.refresh();
      },
      dblclick: () => {
        this._createFunc(false);
        this.refresh();
      }
    },
    focus: {},
    resident: {
      pointMove: (e: Feature) => {
        console.log(e, 'e');
        this.refresh();
      }
    },
    update: {
      pointMove: () => {
        this.refresh();
      }
    }
  };

  _options: LineStringOptions;

  coordinates: Array<lineStringItem>;

  id: string;

  properties: GeoJsonProperties;

  points: Array<Point> = [];

  constructor(map: Map, options: LineStringOptions) {
    super(map, VARS.LINE_STRING_SOURCE_NAME, VARS.LINE_STRING_LAYERS);

    this._options = options;
    this.id = this._options.id || uuidV4();
    this.properties = this._options.properties || {};
    this.coordinates = this._options.coordinates || [[-1, -1]];

    if (this.coordinates.toString() === LineString.EMPTY) {
      this._options.immediate && this.start();
    } else {
      this.points = this.coordinates.map((coordinate, index) => new Point(this._map, {
        type: 'index',
        name: index + 1,
        coordinates: coordinate,
      }))

      this.refresh();
      this._residentFunc(true);
    }
  }

  get meta(): lineStringType {
    return this._options.type
  }

  get activeStyle(): GeoJsonProperties {
    const styleMap = {
      'circle': {
        strokeColor: '#f00',
      },
      'arrow': {},
      'index': {
        strokeColor: '#f00',
        textColor: '#f00'
      },
    }

    return styleMap[this.meta];
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
        }
        break;
      case "arrow":
        props = {
          ...props,
        }
        break;
      case "index":
        props = {
          ...props,
        }
        break;
      default:
        throw new Error(`Unknown feature type ${this.meta}`);
    }

    return { ...this.properties, ...props }
  }

  get feature(): Feature {
    return lineString(this.points.map(point => point.coordinates), { ...this.style, id: this.id }, {
      id: this.id,
    })
  }

  _createFunc(value: boolean, key?: PlotEventKey) {
    if (key) {
      console.log('开启key');
      return;
    }
    this._map[value ? 'on' : 'off']('click', this._event.create.click!)
    this._map[value ? 'on' : 'off']('dblclick', this._event.create.dblclick!)
  }

  _residentFunc(value: boolean, key?: PlotEventKey) {
    if (key) {
      console.log('开启key');
      return;
    }
    this._map[value ? 'on' : 'off'](VARS.EVENTS.POINT_MOVE, this._event.update.pointMove!)
  }

  _updateFunc() {}

  focus(): void {
  }

  move(value: Position): void {
  }

  position(): void {
  }

  refresh(): void {
    this._render(this.feature)
  }

  remove(): void {
  }

  select(): void {
  }

  start(): void {
  }

  unFocus(): void {
  }

  unSelect(): void {
  }

  update(value: Position): void {
  }
}

export default LineString;
