import type { Point } from 'mapbox-gl';
import type { GeoJsonProperties } from "geojson";
/**
 * 范围 [minX, minY, maxX, maxY]
 */
export type BBox = [number, number, number, number];
export type Id = string | number | undefined;
/**
 * 初始基准点的位置
 */
export declare enum Directions {
    TOP_LEFT = 0,
    TOP_RIGHT = 1,
    BOTTOM_RIGHT = 2,
    BOTTOM_LEFT = 3
}
/**
 * 范围值枚举
 */
export declare enum Scopes {
    MIN_X = 0,
    MIN_Y = 1,
    MAX_X = 2,
    MAX_Y = 3
}
/**
 * bbox-范围 dir-初始基准点的位置 options-配置
 */
export interface ItemOptions {
    position: Point;
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
