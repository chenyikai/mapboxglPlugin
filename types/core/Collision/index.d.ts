import RBush from 'rbush';
import Item from 'lib/core/Collision/item.ts';
import { Directions, Id } from "types/core/Collision/item";
import type { Map, LngLat } from 'mapbox-gl';
import type { GeoJsonProperties } from "geojson";
interface CollisionOptions {
  map: Map;
  collisions: [];
}
interface collisionItem {
  lngLat: LngLat;
  width: number;
  height: number;
  dir?: Directions;
  expand?: {
    x: number;
    y: number;
  };
  options?: {
    id?: Id;
    properties?: GeoJsonProperties;
  };
}
declare class Collision {
  _tree: RBush<Item>;
  _map: Map | undefined;
  _collisionList: Array<Item>;
  constructor(config: CollisionOptions);
  add(collisionItem: collisionItem): Id | null;
  setCollisions(item: Item): Id;
  collides(): void;
}
export default Collision;
