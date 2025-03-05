import { BBox } from "rbush"
import { CollisionItemOptions } from "types/core/Collision/item.ts";

export interface CollisionOptions {
    collisions?: CollisionItemOptions[];
}
export interface collisionItem {
    bbox: BBox
}
