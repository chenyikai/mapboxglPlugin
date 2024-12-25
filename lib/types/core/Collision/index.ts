import { Directions, Id } from "types/core/Collision/item";
import type { Map, LngLat } from 'mapbox-gl';
import type { GeoJsonProperties } from "geojson";
export interface CollisionOptions {
    map: Map;
    collisions: [];
}
export interface collisionItem {
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
