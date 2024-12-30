import Ship from 'lib/module/ShipManage/shipTypes/ship.ts'
import { Map } from "mapbox-gl";
import { ShipOptions } from "types/module/ShipManage/ship.ts";

type ShipConstructor<T extends Ship> = new (map: Map, options: ShipOptions) => T;

export interface shipManageOptions {
  plugins?: Array<shipPlugin>,
  props?: {
    id: string,
    name: string,
    position: string,
    width: string,
    height: string,
    dir: string,
    speed: string,
    type: string,
    status: string,
    time: string
  }
}

export type shipPlugin = ShipConstructor<Ship>

export interface shipData {
  [key: string]: unknown
}
