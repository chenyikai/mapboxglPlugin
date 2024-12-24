/**
 * 范围 [minX, minY, maxX, maxY]
 */
export declare type BBox = [number, number, number, number]

export declare type Id = string | number | undefined;

/**
 * 初始基准点的位置
 */
export declare enum Directions {
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
export declare enum Scopes {
  MIN_X,
  MIN_Y,
  MAX_X,
  MAX_Y,
}

/**
 * bbox-范围 dir-初始基准点的位置 options-配置
 */
export declare interface ItemOptions {
  position: Point,
  width: number,
  height: number,
  dir?: Directions;
  expand?: { x: number, y: number },
  options?: { id?: Id, properties?: GeoJsonProperties };
}

declare class Item {
  bbox: BBox;
  dir: Directions | undefined;
  options: ItemOptions["options"] | undefined;
  id: Id;
  static TOP: Directions;
  static RIGHT: Directions;
  static BOTTOM: Directions;
  static LEFT: Directions;
  static TOP_LEFT: Directions;
  static TOP_RIGHT: Directions;
  static BOTTOM_RIGHT: Directions;
  static BOTTOM_LEFT: Directions;
  static CENTER: Directions;
  static MIN_X: Scopes.MIN_X;
  static MIN_Y: Scopes.MIN_Y;
  static MAX_X: Scopes.MAX_X;
  static MAX_Y: Scopes.MAX_Y;
  constructor(config: ItemOptions);
  _init({ bbox, dir, options }: ItemOptions): void;
  getCorner(corner: Scopes): number;
  getBbox(): BBox;
  getWidth(): number;
  getHeight(): number;
  update(config: ItemOptions): void;
  polygon(): Feature<Polygon, GeoJsonProperties>;
  intersects(other: BBox): boolean;
}
export default Item;
