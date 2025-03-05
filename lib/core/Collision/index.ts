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
    if (Array.isArray(config?.collisions)) {
      this.load(config.collisions);
    }
  }

  load(collisions: Array<CollisionItemOptions>) {
    this._tree.clear()

    this._collisionList = collisions.map(item => new CollisionItem(item))
    this.collides()
  }

  getItem(id: string | number) {
    return this._collisionList.find(item => item.id === id)
  }

  getCollisions() {
    return this._collisionList
  }

  collides() {
    if (!this._map) return;

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
        if (isCollides) {
          item.setVisible(false)
        } else {
          this._tree.insert(item)
          item.setVisible(true)
          break;
        }
      }
    }

    return this.getCollisions();
  }
}

export default Collision;
