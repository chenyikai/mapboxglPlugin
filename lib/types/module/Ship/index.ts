import { BaseShipOptions } from "types/module/Ship/plugins/BaseShip.ts";
import BaseShip from "lib/module/Ship/plugins/BaseShip.ts";

export interface ShipOptions {
  plugins?: Array<any>;
  data?: Array<BaseShip>;
}

export type ship = BaseShipOptions & {
  type: string;
}
