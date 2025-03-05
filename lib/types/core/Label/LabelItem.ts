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

export interface LabelItemOptions {
  id: string,
  ctx: CanvasRenderingContext2D,
  dir: Directions,
  ex?: number,
  ey?: number,
  padding?: number,
}

export type Id = string | number | undefined;
