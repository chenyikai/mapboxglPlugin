import EventEmitter from "eventemitter3";
import { GeoJSONSource, Map } from "mapbox-gl";
import BaseShip from "lib/module/Ship/plugins/BaseShip.ts";
import { BaseShipOptions } from "types/module/Ship/plugins/BaseShip.ts";
import { ShipOptions } from 'types/module/Ship/index.ts'
import { SHIP_SOURCE_NAME } from "lib/module/Ship/vars.ts";
import Collision from 'lib/core/Collision/index.ts'
import Tooltip from 'lib/core/Tooltip/index.ts'
import { CollisionItemOptions } from "types/core/Collision/item.ts";

class Ship extends EventEmitter {

  _map: Map;
  _options: ShipOptions | undefined;
  ships: Array<BaseShip> = [];
  tooltips: Array<Tooltip> = [];
  _collision: Collision;

  constructor(map: Map, options?: ShipOptions) {
    super();

    this._map = map;
    this._options = options;
    this.ships = options?.data || [];

    this._collision = new Collision(this._map, {
      collisions: this._createCollisions()
    })

    if (this._createCollisions().length > 0) {
      this.collisionTooltip()
    }
  }

  get _plugins(): Array<any> {
    return this._options?.plugins || [];
  }

  collisionTooltip() {
    this._collision.load(this._createCollisions())?.forEach((collision) => {
      if (collision.visible) {
        const tooltip = this.tooltips.find(tooltip => tooltip.id === collision.id)
        const ship = this.ships.find(ship => ship.getId() === collision.id)
        if (ship && tooltip) {
          tooltip.setAnchor(collision.dir)
          ship.setTooltip(tooltip)
          // ship.render()
        }
      }
    })
  }

  add(ship: BaseShipOptions) {
    const Plugin = this._plugins.find(item => ship.type === item.NAME)
    if (!Plugin) {
      console.warn(`${ship.type} can't be defined`);
      return;
    }
    const plugin: BaseShip = new Plugin(this._map, ship)
    const tooltip = new Tooltip(this._map, {
      id: plugin.getId(),
      visible: true,
      className: 'mapbox-gl-ship-name-tooltip',
      position: plugin.getPosition(),
      offsetX: 5,
      offsetY: 25,
      element: plugin.shipName(),
      anchor: 'bottom-right'
    })

    tooltip.render()
    this.tooltips.push(tooltip)
    // plugin.setTooltip(tooltip)
    // plugin.render()
    // plugin.events().on(['zoom', 'click', 'mouseenter', 'mouseleave'])

    this.ships.push(plugin)
  }

  load(ships: Array<BaseShipOptions>) {
    this.ships = []

    ships.forEach(ship => this.add(ship))

    // this.collisionTooltip()

    this.render()
    this._map.on('zoom', () => {
      this.render()
    })
    return this.ships
  }

  remove() {}

  removeAll() {
    this.ships.forEach(ship => ship.remove())
    this.ships = []
  }

  install(plugin: any) {
    if (this._options?.plugins) {
      this._options?.plugins.push(plugin)
    } else {
      if (this._options) {
        this._options.plugins = [plugin]
      } else {
        this._options = {
          plugins: [plugin]
        }
      }
    }
  }

  uninstall(name: string) {
    if (this._options?.plugins) {
      const index = this._options?.plugins.indexOf(name)
      this._options.plugins.splice(index, 1)
    }
  }

  _createCollisions(): Array<CollisionItemOptions> {
    return this.tooltips.map(tooltip => {
      return {
        ...tooltip.getAllBbox(),
        id: tooltip.id
      }
    })
  }

  render() {
    const features = this.ships.map(ship => {
      const tooltip = this.tooltips.find(item => item.id === ship.getId())
      if (tooltip) {
        tooltip.setLngLat(ship.getPosition())
      }
      return ship.getFeature()
    }).flat()
    this._map.getSource<GeoJSONSource>(SHIP_SOURCE_NAME)?.setData({
      type: 'FeatureCollection',
      features: features,
    })
  }
}

export default Ship
