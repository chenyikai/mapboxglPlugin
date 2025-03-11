import RBush from 'rbush'
import CollisionItem from 'lib/core/Collision/CollisionItem.ts';
import type { Map } from 'mapbox-gl'
import type { CollisionOptions } from "types/core/Collision"
import { CollisionItemOptions } from "types/core/Collision/item.ts";
// import { BBox } from "rbush";

class Collision {

  _tree: RBush<CollisionItem> = new RBush();

  _map: Map | undefined;

  _collisionList: Array<CollisionItem> = [];

  constructor(map: Map, config?: CollisionOptions) {
    this._map = map;
    if (Array.isArray(config?.collisions) && config?.collisions.length > 0) {
      this.load(config.collisions);
    }
  }

  load(collisions: Array<CollisionItemOptions>) {
    this._tree.clear()

    this._collisionList = collisions.map(item => new CollisionItem(item))

    return this.collides()
  }

  getItem(id: string | number) {
    return this._collisionList.find(item => item.id === id)
  }

  clear(): void {
    this._tree.clear()
  }

  getCollisions() {
    return this._collisionList
  }

  collides() {
    // const dpr: number = window.devicePixelRatio || 1
    // const canvas_bbox: BBox = {
    //   minX: 0,
    //   minY: 0,
    //   maxX: this._map._canvas.width / dpr,
    //   maxY: this._map._canvas.height / dpr,
    // }
    for(const item of this._collisionList) {
      for(const dir of item.dirs) {
        item.setDir(dir)

        const isCollides = this._tree.collides(item)
        item.setVisible(!isCollides)

        if (item.visible) {
          this._tree.insert(item)
          break;
        }
      }
    }

    return this.getCollisions();
  }
}

export default Collision;
