import Plot from './Plot.ts'
import Point from './Point.ts'
import { Feature, GeoJsonProperties, Position } from "geojson";
import { Map, MapMouseEvent } from "mapbox-gl";
import { v4 as uuidV4 } from "uuid";
import { lineString } from '@turf/turf'
import { EVENTS, LINE_STRING_LAYER, LINE_STRING_SOURCE_NAME } from "lib/module/Draw/module/vars.ts";
import { plotEvent } from "types/module/Draw/plot.ts";

interface lineStringOptions {
  id?: string;
  name?: string | number;
  coordinates?: Array<Position> | Array<Point>;
  immediate?: boolean
  properties?: GeoJsonProperties;
}

class LineString extends Plot{
  static EMPTY: string = '-2'

  coordinates: Array<Position> | Array<Point>;

  points: Array<Point> = [];

  id: string;

  properties: GeoJsonProperties;

  _options: lineStringOptions;

  _event: plotEvent = {
    create: {
      click: () => {
      }
    },
    update: {
      mousedown: () => {
      },
      mousemove: () => {
      },
      mouseup: () => {
      }
    },
    resident: {
      mousemove: (e: MapMouseEvent) => {
      },
      click: (e: MapMouseEvent) => {
      },
      pointMove: () => {
        // if (this.isSelf(feature)) {
          this._render(this.feature);
        // }
      }
    }
  }

  constructor(map: Map, options: lineStringOptions) {
    super(map, LINE_STRING_SOURCE_NAME, LINE_STRING_LAYER);
    this._options = options;
    this.id = this._options.id || uuidV4();
    this.properties = this._options.properties || {};
    this.coordinates = this._options.coordinates || [[-1, -1]];

    if (this.coordinates.toString() === LineString.EMPTY) {
      this._options.immediate && this.start();
    } else {
      this.points = this.coordinates.map((coordinate: Position | Point, index: number) => {
        if (coordinate instanceof Point) {
          return coordinate
        } else {
          return new Point(this._map, {
            type: 'index',
            coordinates: coordinate,
            name: index + 1,
            properties: {
              belong: this.id
            }
          })
        }
      })

      this._render(this.feature);
      this._residentFunc(true)
    }
  }

  get feature() {
    return lineString(this.points.map(point => point.coordinates), { ...this.properties, id: this.id }, {
      id: this.id,
    });
  }

  get layer(): string {
    return ''
  }

  start() {}

  focus(): void {
  }

  move(value: Position): void {
    console.log(value, 'vale');
  }

  position(): void {
  }

  select(): void {
  }

  unselect(): void {
  }

  _createFunc(value: boolean) {
    // this._map[value ? 'on' : 'off']('click', this._event.create.click!)
  }

  _updateFunc(value: boolean) {
    // this._map[value ? 'on' : 'off']('mousedown', this.layer, this._event.update.mousedown!)
  }

  _residentFunc(value: boolean) {
    // this._map[value ? 'on' : 'off']('mouseenter', this.layer, this._event.resident.mouseenter!)
    this._map[value ? 'on' : 'off']('mousemove', this._event.resident.mousemove!)
    this._map[value ? 'on' : 'off']('click', this._event.resident.click!)
    this._map[value ? 'on' : 'off'](EVENTS.POINT_MOVE, this._event.resident.pointMove!)
  }
}

export default LineString
