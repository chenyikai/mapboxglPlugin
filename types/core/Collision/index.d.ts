import RBush from 'rbush';
import Item from 'lib/core/Collision/item.ts';
import { Id } from "types/core/Collision/item";
import type { Map } from 'mapbox-gl';
import type { CollisionOptions, collisionItem } from "types/core/Collision";
declare class Collision {
    _tree: RBush<Item>;
    _map: Map | undefined;
    _collisionList: Array<Item>;
    constructor(config: CollisionOptions);
    add(collisionItem: collisionItem): Id | null;
    set(item: Item): Id;
    collides(): void;
}
export default Collision;
