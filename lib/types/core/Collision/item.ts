import type { Point } from 'mapbox-gl'
import type { GeoJsonProperties } from "geojson";

/**
 * 范围 [minX, minY, maxX, maxY]
 */
export type BBox = [number, number, number, number]

export type Id = string | number | undefined;

/**
 * 初始基准点的位置
 */
export enum Directions {
  // TOP,
  // RIGHT,
  // BOTTOM,
  // LEFT,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
  // CENTER,
}

/**
 * 范围值枚举
 */
export enum Scopes {
  MIN_X,
  MIN_Y,
  MAX_X,
  MAX_Y,
}

/**
 * bbox-范围 dir-初始基准点的位置 options-配置
 */
export interface ItemOptions {
  position: Point,
  width: number,
  height: number,
  dir?: Directions;
  expand?: { x: number, y: number },
  options?: { id?: Id, properties?: GeoJsonProperties };
}
