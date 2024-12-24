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

    this.setCollisions(item);
    // TODO 会有重复情况
    this._tree.insert(item);

    return item.getId();
  }

  setCollisions(item: Item): Id {
    const index = this._collisionList.findIndex(collision => collision.getId() === item.getId())
    if (index !== -1) {
      set(this._collisionList, index, item);
    } else {
      this._collisionList.push(item);
    }

    return item.getId();
  }

  collides() {
    if (!this._map) return;

    const dpr: number = window.devicePixelRatio || 1
    const canvas_bbox: BBox = [0, 0, this._map._canvas.width / dpr, this._map._canvas.height / dpr]
    for(const item of this._collisionList) {
      for(const directionsKey in Directions) {
        const direction = +Directions[directionsKey];
        item.changeDir(direction)
        if (!item || !item.intersects(canvas_bbox)) {
          continue
        }
      }
    }
  }
}

export default Collision;
