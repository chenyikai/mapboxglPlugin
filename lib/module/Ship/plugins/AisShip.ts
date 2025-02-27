import BaseShip from "lib/module/Ship/plugins/BaseShip.ts";
import { Map, Point } from "mapbox-gl";
import { AisShipOptions } from 'types/module/Ship/plugins/AisShip.ts'
import { ShipIcon, ShipShape, ShipDirection } from "types/module/Ship/plugins/BaseShip.ts";
import { Feature, Position } from "geojson";
import { distanceToPx } from "lib/utils/util.ts";
import { lineString, lineToPolygon, point, transformRotate } from "@turf/turf";

class AisShip extends BaseShip{
  constructor(map: Map, options: AisShipOptions) {
    super(map, options);
  }

  get direction(): ShipDirection {
    return 'left';
  }

  get feature(): Array<Feature> {
    return [this.real()];
  }

  icon(): ShipIcon {
    return point(<Position>this._options.position, this._options, {
      id: this._options.id,
    });
  }

  init(): void {
  }

  real(): Feature {
    if (this.shape === null) {
      return this.icon()
    }

    let points: Array<Point> = [
      this.shape.head,
      this.shape.rightBow,
      this.shape.rightQuarter,
      this.shape.rightStern,
      this.shape.leftStern,
      this.shape.leftQuarter,
      this.shape.leftBow,
    ]

    if (this.direction === "left" || this.direction === "right") {
      points = [ this.shape.direction!, this.shape.turn!, ...points, this.shape.turn!, this.shape.direction!,]
    } else if (this.direction === 'straight') {
      points = [this.shape.turn!, ...points, this.shape.turn!]
    }

    const ship = lineToPolygon(lineString(points.map(item => this._map.unproject(item).toArray())))
    return {
      ...transformRotate(ship, this._options.dir),
      id: this._options.id,
      properties: this._options
    };
  }

  get shape(): ShipShape | null {
    if (this._options.width && this._options.height) {
      const { x, y }: Point = this._map.project(this._options.position)
      const expandX: number =  distanceToPx(this._map, this._options.width) / 2
      const expandY: number = distanceToPx(this._map, this._options.height) / 2
      let direction = null

      if (this.direction === 'left') {
        direction = new Point(x - expandX, y - expandY * 2)
      } else if (this.direction === 'right') {
        direction = new Point(x + expandX, y - expandY * 2)
      }

      return {
        direction,
        turn: this.direction === 'static' ? null :new Point(x, y - expandY * 2),
        head: new Point(x, y - expandY),
        rightBow: new Point(x + expandX, y - expandY * 0.5),
        rightQuarter: new Point(x + expandX, y + expandY * 0.85),
        rightStern: new Point(x + expandX * 0.7, y + expandY),
        leftStern: new Point(x - expandX * 0.7, y + expandY),
        leftQuarter: new Point(x - expandX, y + expandY * 0.85),
        leftBow: new Point(x - expandX, y - expandY * 0.5)
      }
    }
    return null;
  }
}

export default AisShip;
