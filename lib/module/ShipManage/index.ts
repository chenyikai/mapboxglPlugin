import { Map } from 'mapbox-gl'
import { shipData, shipManageOptions, shipPlugin } from "lib/types/module/ShipManage";
import { isNull } from "lib/utils/validate.ts";
import NormalShip from 'lib/module/ShipManage/shipTypes/normalShip.ts'
import Collision from 'lib/core/Collision'

class ShipManage {
  _map: Map;
  _options: shipManageOptions | undefined;
  _plugins: Array<shipPlugin> = [NormalShip]
  collision: Collision | undefined;

  constructor(map: Map, options?: shipManageOptions) {
    this._map = map
    this._options = options
    if (options && options.plugins) {
      this._plugins = [...this._plugins, ...options.plugins]
    }

    this.collision = new Collision({ map })
  }


  get _props() {
    if (isNull(this._options) || isNull(this._options?.props)) {
      return {
        dir: "dir",
        height: "height",
        id: "id",
        name: "name",
        position: "position",
        speed: "speed",
        status: "status",
        time: "time",
        type: "type",
        width: "width"
      }
    }

    return this._options!.props;
  }

  add(ship: shipData) {
    console.log(ship, 'ship');
  }

  load(ships: Array<shipData>) {
    console.log(ships, 'ships');
  }

  focus() {}

  _getShip() {}

  _getPlugin() {
    return NormalShip
    // return this._plugins.find((p) => p.NAME === "ShipPlugin");
  }
}

export default ShipManage;
