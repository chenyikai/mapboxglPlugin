import BaseShip from "lib/module/Ship/plugins/BaseShip.ts";
import { LngLat, Map, Point } from "mapbox-gl";
import { AisShipOptions } from 'types/module/Ship/plugins/AisShip.ts'
import { ShipShape, ShipDirection } from "types/module/Ship/plugins/BaseShip.ts";
import { Feature, Polygon, LineString } from "geojson";
import { addLayer, addSource, distanceToPx } from "lib/utils/util.ts";
import { lineString, lineToPolygon, point, transformRotate } from "@turf/turf";
import {
  SHIP_ICON_LAYER,
  SHIP_REAL_LAYER,
  SHIP_REAL_OUTLINE_LAYER,
} from "lib/module/Ship/vars.ts";
import * as geojson from 'geojson'
import Tooltip from "lib/core/Tooltip";

class AisShip extends BaseShip{
  tooltip: Tooltip

  constructor(map: Map, options: AisShipOptions) {
    super(map, options);
    this.init()

    this.tooltip = new Tooltip(this._map, {
      id: this._options.id,
      className: 'mapbox-gl-ship-name-tooltip',
      position: this._options.position,
      offsetX: 5,
      offsetY: 25,
      element: this.shipName(),
      anchor: 'bottom-right'
    })

    this.render()
    this._map.on('zoomend', () => {
      this.render()
    })
  }

  get id(): AisShipOptions['id'] {
    return this._options.id
  }

  get position(): LngLat {
    return this._options.position;
  }

  get direction(): ShipDirection {
    return 'left';
  }

  get feature(): Array<Feature> {
    if (this._map.getZoom() >= 16) {
      return [this.real()]
    } else {
      return [this.icon()];
    }
  }

  icon(): Feature<geojson.Point> {
    return point(this._options.position.toArray(), {
      ...this._options,
      icon: this._options.icon.name,
      dir: this._options.dir,
    }, {
      id: this._options.id,
    });
  }

  init(): void {
    addSource(this._map, AisShip.SOURCE, {
      type: 'geojson',
      dynamic: true,
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    addLayer(this._map, SHIP_ICON_LAYER)
    addLayer(this._map, SHIP_REAL_LAYER)
    addLayer(this._map, SHIP_REAL_OUTLINE_LAYER)
    // addLayer(this._map, SHIP_REAL_CONNECT_LINE_LAYER)

    this._map.on('click', SHIP_ICON_LAYER.id, e => {
      console.log(e.features, 'e');
    })
  }

  shipName(): HTMLElement {
    const id = `${this._options.id}-ship-name-box`
    let shipNameBox = document.getElementById(id)
    if (shipNameBox) {
      return shipNameBox
    }

    shipNameBox = document.createElement('div')
    shipNameBox.id = id
    shipNameBox.classList.add('ship-name-box');

    const shipName = document.createElement('div')
    shipName.innerText = this._options.name
    shipName.classList.add('ship-name')

    shipNameBox.appendChild(shipName)

    return shipNameBox
  }

  real(): Feature<Polygon> | Feature<geojson.Point> {
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
      this.shape.head,
    ]

    if (this.direction === "left" || this.direction === "right") {
      points = [ this.shape.direction!, this.shape.turn!, ...points, this.shape.turn!, this.shape.direction!]
    } else if (this.direction === 'straight') {
      points = [this.shape.turn!, ...points, this.shape.turn!]
    }

    const line: Feature<LineString> = lineString(points.map(item => this._map.unproject(item).toArray()))
    let ship: Feature<Polygon> = lineToPolygon(line) as Feature<Polygon>;
    ship = transformRotate<Feature<Polygon>>(ship, this._options.dir, {
      pivot: this._options.position.toArray(),
    })
    ship.id = this._options.id
    ship.properties = {
      ...this._options,
      outLine: true
    }
    return ship;
  }

  get shape(): ShipShape | null {
    if (this._options.width && this._options.height) {
      const { x, y }: Point = this._map.project(this._options.position)
      const expandX: number =  distanceToPx(this._map, this._options.width) / 2
      const expandY: number = distanceToPx(this._map, this._options.height) / 2

      const direction: Point = new Point(0, y - expandY * 2)
      direction.x = this.direction === 'left' ? x - expandX : x + expandX

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

  render() {
    this.tooltip.render()
    this._render(this.feature)
  }

  getShipCourseDirection(shipInfo: any) {
    if (shipInfo.hdg && shipInfo.hdg >= 0 && shipInfo.hdg < 360) {
      if (shipInfo.statusId === 0 || shipInfo.statusId === 7 || shipInfo.statusId === 8) {
        if (shipInfo.sog <= 0.5) {
          return shipInfo.hdg || shipInfo.cog || 0
        } else {
          if (Math.abs(shipInfo.hdg - shipInfo.cog) > 30) {
            return shipInfo.cog
          }
          return shipInfo.cog || shipInfo.hdg || 0
        }
      } else {
        return shipInfo.hdg || shipInfo.cog || 0
      }
    } else {
      return shipInfo.cog || 0
    }
  }
}

export default AisShip;
