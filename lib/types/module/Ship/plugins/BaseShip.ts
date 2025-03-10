import { Map, Point, LngLat, MapEventType } from "mapbox-gl";
import { Feature, Point as PointGeometry } from "geojson";
import BaseShip from 'lib/module/Ship/plugins/BaseShip.ts'

export interface BaseShipOptions {
  id: string | number,
  name: string,
  position: LngLat,
  width: number | null,
  height: number | null,
  dir: number,
  speed: number,
  hdg: number,
  cog: number,
  rot: number,
  type: string | null,
  statusId: number,
  status: string,
  time: string,
  tooltip?: boolean,
  immediate?: boolean,
  realZoom?: number,
  top?: number | null,
  left?: number | null,
  right?: number | null,
  bottom?: number | null,
  icon: string
}

export type ShipSubclass<T extends BaseShip> = new (map: Map, options: BaseShipOptions) => T;

/**
 * 方向点 拐点 船首 船首右舷 船尾右舷 右船尾 左船尾 船尾左舷 船首左舷
 */
export type ShipShape = {
  leftDirection: Point,
  rightDirection: Point,
  turn: Point,
  head: Point,
  rightBow: Point,
  rightQuarter: Point,
  rightStern: Point
  leftStern: Point,
  leftQuarter: Point,
  leftBow: Point,
}

export type ShipIcon = Feature<PointGeometry>

export type ShipDirection = 'static' | 'left' | 'right' | 'straight'

export interface EventsControl {
  on: (eventNames?: Array<MapEventType>) => void;
  off: (eventNames?: Array<MapEventType>) => void;
  once: (eventNames?: Array<MapEventType>) => void;
}
