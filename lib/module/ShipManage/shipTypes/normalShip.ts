import { ShipShape, ShipOptions } from "types/module/ShipManage/ship.ts";
import { Map, Point } from 'mapbox-gl'
import { lineString, lineToPolygon, transformRotate } from '@turf/turf'
import Ship from './ship.ts'
import { distanceToPx } from "lib/utils/util.ts";


class NormalShip extends Ship{

  static NAME: string = 'normal';

  constructor(map: Map, options: ShipOptions) {
    super(map, options);
  }

  /**
   * 船舶形状
   */
  shape(): ShipShape {
    const { x, y }: Point = this._map.project(this._options.position)
    const expandX: number =  distanceToPx(this._map, this._options.width) / 2
    const expandY: number = distanceToPx(this._map, this._options.height) / 2

    const bow = new Point(x, y - expandY)
    const forwardStarboard = new Point(x + expandX, y - expandY * 0.5)
    const aftStarboard = new Point(x + expandX, y + expandY * 0.85)
    const rightAft = new Point(x + expandX * 0.7, y + expandY)
    const leftAft = new Point(x - expandX * 0.7, y + expandY)
    const aftPort = new Point(x - expandX, y + expandY * 0.85)
    const forwardPort = new Point(x - expandX, y - expandY * 0.5)

    return [bow, forwardStarboard, aftStarboard, rightAft, leftAft, aftPort, forwardPort]
  }

  icon() {
    return []
  }

  /**
   * 真实船舶（根据位置，宽，高，方向绘制）
   */
  real() {
    const points = this.shape().map(item => this._map.unproject(item).toArray())
    const line = lineString(points)
    const polygon = lineToPolygon(line)
    return {
      ...transformRotate(polygon, this._options.dir),
      id: this._options.id,
      properties: this._options
    }
  }
}

export default NormalShip;
