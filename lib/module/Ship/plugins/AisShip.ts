import BaseShip from "lib/module/Ship/plugins/BaseShip.ts";
import { LngLat, Map, Point } from "mapbox-gl";
import { AisShipOptions } from 'types/module/Ship/plugins/AisShip.ts'
import { ShipShape, ShipDirection, EventsControl } from "types/module/Ship/plugins/BaseShip.ts";
import { addLayer, addSource, distanceToPx } from "lib/utils/util.ts";
import { lineString, lineToPolygon, point, transformRotate } from "@turf/turf";
import {
  SHIP_ICON_LAYER,
  SHIP_REAL_LAYER,
  SHIP_REAL_OUTLINE_LAYER,
} from "lib/module/Ship/vars.ts";
import * as GeoJSON from 'geojson'
import { isNull } from "lib/utils/validate";
import { BBox } from "rbush";
import Tooltip from 'lib/core/Tooltip/index.ts'


class AisShip extends BaseShip{

  static NAME = 'ais'

  zoomFunc = this._zoom.bind(this)
  clickFunc = this._click.bind(this)
  enterFunc = this._enter.bind(this)
  leaveFunc = this._leave.bind(this)

  constructor(map: Map, options: AisShipOptions) {
    super(map, options);
    this.init()

    if (this._options.immediate) {
      this.render()
      this.events().on(['zoom'])
    }
  }

  getId(): AisShipOptions['id'] {
    return this._options.id
  }

  getPosition(): LngLat {
    const zoom = this._options.realZoom ? this._options.realZoom : 16
    if (this._map.getZoom() >= zoom) {
      if (this.offset().x === 0 && this.offset().y === 0) {
        return this._options.position;
      } else {
        const orientation: Point = this._map.project(this._options.position)
        const x = orientation.x + this.offset().x;
        const y = orientation.y + this.offset().y;
        return this._map.unproject(new Point(x, y));
      }
    }

    return this._options.position;
  }

  getDir() {
    if (this._options.hdg && this._options.hdg >= 0 && this._options.hdg < 360) {
      if (this._options.statusId === 0 || this._options.statusId === 7 || this._options.statusId === 8) {
        if (this._options.speed <= 0.5) {
          return this._options.hdg || this._options.cog || 0
        } else {
          if (Math.abs(this._options.hdg - this._options.cog) > 30) {
            return this._options.cog
          }
          return this._options.cog || this._options.hdg || 0
        }
      } else {
        return this._options.hdg || this._options.cog || 0
      }
    } else {
      return this._options.cog || 0
    }
  }

  getDirection(): ShipDirection {
    let _rateOfTurn = 0
    if (this._options.rot > 180) {
      _rateOfTurn = this._options.rot - 180
    }
    if (this._options.rot < -180) {
      _rateOfTurn = this._options.rot + 180
    }
    if (this._options.speed === 0 || !this._options.speed) return 'static'
    if (_rateOfTurn === -128.0) return 'static' //-128为特殊值，无转向
    if (_rateOfTurn < 0 && _rateOfTurn > -180) return 'left' //0到-180 左转，-127为每30秒5度以上右转
    if (_rateOfTurn > 0 && _rateOfTurn <= 180) return 'right' //0到 180 右转，127为每30秒5度以上左转
    if (_rateOfTurn === 0) return 'straight'

    return 'static'
  }

  getFeature(): Array<GeoJSON.Feature> {
    const zoom = this._options.realZoom ? this._options.realZoom : 16
    if (this._map.getZoom() >= zoom) {
      return [this.real()]
    } else {
      return [this.icon()];
    }
  }

  icon(): GeoJSON.Feature<GeoJSON.Point> {
    return point(this.getPosition().toArray(), {
      ...this._options,
      icon: this._options.icon,
      dir: this.getDir(),
    }, {
      id: this.getId(),
    });
  }

  init(): void {
    addSource(this._map, AisShip.SOURCE, {
      type: 'geojson',
      // dynamic: true,
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    addLayer(this._map, SHIP_ICON_LAYER)
    addLayer(this._map, SHIP_REAL_LAYER)
    addLayer(this._map, SHIP_REAL_OUTLINE_LAYER)
  }

  events(): EventsControl {
    return {
      on: (eventNames) => {
        eventNames?.includes('zoom') && this._map.on('zoom', this.zoomFunc)
        eventNames?.includes('click') && this._map.on('click', SHIP_ICON_LAYER.id, this.clickFunc)
        eventNames?.includes('mouseenter') && this._map.on('mouseenter', SHIP_ICON_LAYER.id, this.enterFunc)
        eventNames?.includes('mouseleave') && this._map.on('mouseleave', SHIP_ICON_LAYER.id, this.leaveFunc)
      },
      off: (eventNames) => {
        eventNames?.includes('zoom') && this._map.off('zoom', this.zoomFunc)
        eventNames?.includes('click') && this._map.off('click', SHIP_ICON_LAYER.id, this.clickFunc)
        eventNames?.includes('mouseenter') && this._map.off('mouseenter', SHIP_ICON_LAYER.id, this.enterFunc)
        eventNames?.includes('mouseleave') && this._map.off('mouseleave', SHIP_ICON_LAYER.id, this.leaveFunc)
      },
      once: () => {}
    }
  }

  remove() {
    this.events().off()
  }

  setTooltip(tooltip: Tooltip): void {
    this.tooltip && this.tooltip.remove()
    this.tooltip = null

    this.tooltip = tooltip
  }

  shipName(): HTMLElement {
    const id = `${this.getId()}-ship-name-box`
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

  offset() {
    const offset = new Point(0, 0);

    if (
        !isNull(this._options.top) &&
        !isNull(this._options.bottom) &&
        !isNull(this._options.left) &&
        !isNull(this._options.right)
    ) {
      const bbox: BBox = {
        minX: -distanceToPx(this._map, this._options.left!),
        minY: -distanceToPx(this._map, this._options.top!),
        maxX: distanceToPx(this._map, this._options.right!),
        maxY: distanceToPx(this._map, this._options.bottom!),
      }

      offset.x = (bbox.minX + bbox.maxX) / 2
      offset.y = (bbox.maxY + bbox.minY) / 2

    }

    return offset
  }

  real(): GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Feature<GeoJSON.Point> {
    if (this.getShape() === null) {
      return this.icon()
    } else {
      const {
        head,
        rightBow,
        rightQuarter,
        rightStern,
        leftStern,
        leftQuarter,
        leftBow,
        leftDirection,
        rightDirection,
        turn
      } = this.getShape()!
      let points: Array<Point> = [ head, rightBow, rightQuarter, rightStern, leftStern, leftQuarter, leftBow, head ]

      if (this.getDirection() === "left") {
        points = [ leftDirection, turn!, ...points, turn, leftDirection]
      } else if (this.getDirection() === "right") {
        points = [ rightDirection, turn!, ...points, turn, rightDirection]
      } else if (this.getDirection() === 'straight') {
        points = [ turn, ...points, turn]
      }

      const line: GeoJSON.Feature<GeoJSON.LineString> = lineString(points.map(item => this._map.unproject(item).toArray()))
      let ship: GeoJSON.Feature<GeoJSON.Polygon> = lineToPolygon(line) as GeoJSON.Feature<GeoJSON.Polygon>;
      ship = transformRotate<GeoJSON.Feature<GeoJSON.Polygon>>(ship, this.getDir(), {
        pivot: this.getPosition().toArray(),
      })
      ship.id = this.getId()
      ship.properties = {
        ...this._options,
        outLine: true
      }
      return ship;
    }
  }

  getShape(): ShipShape | null {
    if (this._options.width && this._options.height) {
      const { x, y }: Point = this._map.project(this.getPosition())
      const expandX: number =  distanceToPx(this._map, this._options.width) / 2
      const expandY: number = distanceToPx(this._map, this._options.height) / 2

      return {
        leftDirection: new Point(x - expandX, y - expandY * 2),
        rightDirection: new Point(x + expandX, y - expandY * 2),
        turn: new Point(x, y - expandY * 2),
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
    this.tooltip?.setLngLat(this.getPosition())
    this.tooltip?.render()
    this._render(this.getFeature())
  }

  _zoom() {
    // this.tooltip?.setLngLat(this.position)
    this._render(this.getFeature())
  }

  _click() {}

  _enter() {
    this._map.getCanvasContainer().style.cursor = "pointer"
  }

  _leave() {
    this._map.getCanvasContainer().style.cursor = ""
  }
}

export default AisShip;
