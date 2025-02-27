import { LngLatLike, Map, Point } from "mapbox-gl";
import { Feature } from "geojson";
import BaseShip from 'lib/module/Ship/plugins/BaseShip.ts'

export interface BaseShipOptions {
  id: string | number,
  name: string | number,
  position: LngLatLike,
  width: number | null,
  height: number | null,
  dir: number,
  speed: number,
  type: string | null,
  status: string,
  time: string
}

export type BaseShipConstructor<T extends BaseShip> = new (map: Map, options: BaseShipOptions) => T;

export type ShipPlugin = BaseShipConstructor<BaseShip>

/**
 * 方向点 拐点 船首 船首右舷 船尾右舷 右船尾 左船尾 船尾左舷 船首左舷
 */
export type ShipShape = {
  direction: Point | null,
  turn: Point | null,
  head: Point,
  rightBow: Point,
  rightQuarter: Point,
  rightStern: Point
  leftStern: Point,
  leftQuarter: Point,
  leftBow: Point,
}

export type ShipIcon = Feature

export type ShipDirection = 'static' | 'left' | 'right' | 'straight'
