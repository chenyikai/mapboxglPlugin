import RBush from 'rbush'
import Item from 'lib/core/Collision/item.ts';
import { set } from 'lodash-es'
import { BBox, Directions, Id } from "types/core/Collision/item";
import type { Map, LngLat } from 'mapbox-gl'
import type { GeoJsonProperties } from "geojson";

interface CollisionOptions {
  map: Map
  collisions: []
}

interface collisionItem {
  lngLat: LngLat,
  width: number,
  height: number,
  dir?: Directions,
  expand?: { x: number, y: number },
  options?: { id?: Id, properties?: GeoJsonProperties };
}

class Collision {

  _tree: RBush<Item> = new RBush();

  _map: Map | undefined;

  _collisionList: Array<Item> = [];

  constructor(config: CollisionOptions) {
    this._map = config.map;
    this._collisionList = config.collisions || [];
    if (this._collisionList.length > 0) {
      this._tree.load(this._collisionList);
      this.collides()
    }
  }

  add(collisionItem: collisionItem): Id | null {
    if (!this._map) return null;

    const position = this._map.project(collisionItem.lngLat)
    if (!position) return null;

    const item = new Item({
      position,
      width: collisionItem.width,
      height: collisionItem.height,
      expand: collisionItem.expand,
      options: collisionItem.options
    });

    this.set(item);

    return item.getId();
  }

  set(item: Item): Id {
    const index = this._collisionList.findIndex(collision => collision.getId() === item.getId())
    if (index !== -1) {
      set(this._collisionList, index, item);
      this._tree.remove(item, (a, b) => a.getId() === b.getId());
    } else {
      this._collisionList.push(item);
    }
    this._tree.insert(item);

    return item.getId();
  }

  collides() {
    if (!this._map) return;

    const dpr: number = window.devicePixelRatio || 1
    const canvas_bbox: BBox = [0, 0, this._map._canvas.width / dpr, this._map._canvas.height / dpr]
    for(const item of this._collisionList) {
      for(const directionsKey in Directions) {
        const direction: number = +Directions[directionsKey];
        item.setDir(direction)
        const visible: boolean = item.isIntersect(canvas_bbox) && !this._tree.collides(item)
        item.setVisible(visible)
      }
    }
  }
}

export default Collision;
