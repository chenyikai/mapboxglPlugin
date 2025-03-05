import { ShipSubclass } from "types/module/Ship/plugins/BaseShip.ts";
import BaseShip from "lib/module/Ship/plugins/BaseShip.ts";

export interface ShipOptions {
  plugins: Array<ShipSubclass<BaseShip>>;
  data: Array<BaseShip>;
}
