import EventEmitter from "eventemitter3";
import { GeoJSONSource, Map } from "mapbox-gl";
import BaseShip from "lib/module/Ship/plugins/BaseShip.ts";
import { ShipSubclass } from "types/module/Ship/plugins/BaseShip.ts";
import { ShipOptions } from 'types/module/Ship/index.ts'
import { SHIP_SOURCE_NAME } from "lib/module/Ship/vars.ts";
import Collision from 'lib/core/Collision/index.ts'

class Ship extends EventEmitter {

  _map: Map;
  _options: ShipOptions;
  _plugins: Array<ShipSubclass<BaseShip>>;
  ships: Array<BaseShip> = [];
  _collision: Collision;

  constructor(map: Map, options: ShipOptions) {
    super();

    this._map = map;
    this._options = options;
    this._plugins = options.plugins;
    this.ships = options.data;

    this._collision = new Collision(this._map, {
      collisions: this.ships.map(ship => {
        return {
          ...ship.tooltip.getAllBbox(),
          id: ship.id
        }
      })
    })

    this.collisionLabel()

    this._map.on('zoomend', () => {
      this.collisionLabel()
    })
  }

  collisionLabel() {
    this.ships.forEach(ship => {
      // @ts-ignore
      const item = this._collision.getItem(ship.id);

      if (item && item.visible) {
        ship.tooltip.setAnchor(item.dir)
      } else {
        ship.tooltip.remove()
      }

      ship.render()
    })
  }

  add(ship: BaseShip) {
    this.ships.push(ship);
  }

  load(data: Array<BaseShip>) {
    this.ships = data
  }

  render() {
    const zoom = this._map.getZoom()
    const features = this.ships.map(ship => {
      return zoom >= 16 ? ship.real() : ship.icon();
    }).flat()

    this._map.getSource<GeoJSONSource>(SHIP_SOURCE_NAME)?.setData({
      type: 'FeatureCollection',
      features: features,
    })
  }
}

export default Ship
