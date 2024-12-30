import { Map } from 'mapbox-gl'
import { LngLatLike, Point } from "mapbox-gl";
import { Feature } from "geojson";

export interface Ship {
  _map: Map,
  _options: ShipOptions,
  /**
   * 船舶形状
   */
  shape(): ShipShape,
  /**
   * 船舶图标
   */
  icon(): shipIcon,
  /**
   * 真实船舶（根据位置，宽，高，方向绘制）
   */
  real(): Feature,
}

export interface ShipOptions {
  id: string | number,
  name: string | number,
  position: LngLatLike,
  width: number,
  height: number,
  dir: number,
  speed: number,
  type: string,
  status: string,
  time: string
}

/**
 * 船首 船首右舷 船尾右舷 右船尾 左船尾 船尾左舷 船首左舷
 */
export type ShipShape = [ Point, Point, Point, Point, Point, Point, Point ]

export type shipIcon = Array<number>
