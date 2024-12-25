import { bboxPolygon } from '@turf/turf'
import { v4 as uuidV4 } from 'uuid';
import { Point } from 'mapbox-gl'
import { BBox as GeoJSONBBox, Feature, Polygon, GeoJsonProperties } from "geojson";
import { BBox, Id, Directions, Scopes, ItemOptions } from 'types/core/Collision/item'

class Item {

  visible: boolean = true

  _position: Point = new Point(0, 0);

  _expand: { x: number, y: number } = { x: 0, y: 0 };

  _width: number = 0;

  _height: number = 0;

  _bbox: BBox = [-1, -1, -1, -1];

  _dir: Directions | undefined;

  _options: ItemOptions["options"] | undefined;

  _id: Id;

  // 上
  // static TOP: Directions = Directions.TOP;
  // 右
  // static RIGHT: Directions = Directions.RIGHT;
  // 下
  // static BOTTOM: Directions = Directions.BOTTOM;
  // 左
  // static LEFT: Directions = Directions.LEFT;
  // 左上
  static TOP_LEFT: Directions = Directions.TOP_LEFT;
  // 右上
  static TOP_RIGHT: Directions = Directions.TOP_RIGHT;
  // 右下
  static BOTTOM_RIGHT: Directions = Directions.BOTTOM_RIGHT;
  // 左下
  static BOTTOM_LEFT: Directions = Directions.BOTTOM_LEFT;
  // 中
  // static CENTER: Directions = Directions.CENTER;

  // 最小X
  static MIN_X: Scopes = Scopes.MIN_X;
  // 最小Y
  static MIN_Y: Scopes = Scopes.MIN_Y;
  // 最大X
  static MAX_X: Scopes = Scopes.MAX_X;
  // 最大Y
  static MAX_Y: Scopes = Scopes.MAX_Y;

  constructor(config: ItemOptions) {
    this._init(config)
  }

  _init({ position, width, height, dir = Directions.BOTTOM_RIGHT, expand = { x: 0, y: 0 }, options }: ItemOptions) {
    this._position = position
    this._width = width
    this._height = height
    if (expand) {
      this._expand = expand
    }
    this._dir = dir;
    this._options = options;
    this._id = this._options?.id || uuidV4()

    this.setBBox()
  }

  get minX(): number {
    return this._bbox[Item.MIN_X]
  }

  get minY(): number {
    return this._bbox[Item.MIN_Y]
  }

  get maxX(): number {
    return this._bbox[Item.MAX_X]
  }

  get maxY(): number {
    return this._bbox[Item.MAX_Y]
  }

  /**
   * 获取边角值
   * @param corner
   * @return Scopes
   */
  getCorner(corner: Scopes): Scopes {
    return this._bbox[corner];
  }

  setBBox() {
    let maxX: number;
    let maxY: number;
    let minX: number;
    let minY: number;
    if (this._dir === Item.BOTTOM_RIGHT) {
      maxX = this._position.x
      minY = this._position.y

      minX = maxX - ( this._width + this._expand.x )
      maxY = minY + this._height + this._expand.y
    } else if (this._dir === Item.BOTTOM_LEFT) {
      minX = this._position.x
      minY = this._position.y

      maxX = minX + this._width + this._expand.x
      maxY = minY + this._height + this._expand.y
    } else if (this._dir === Item.TOP_LEFT) {
      minX = this._position.x
      maxY = this._position.y

      maxX = minX + this._width + this._expand.x
      minY = maxY - ( this._height + this._expand.y )
    } else if (this._dir === Item.TOP_RIGHT) {
      maxX = this._position.x
      maxY = this._position.y

      minX = maxX - ( this._width + this._expand.x )
      minY = maxY - ( this._height + this._expand.y )
    } else {
      throw new Error(`Unsupported dir: ${this._dir}`);
    }

    this._bbox = [minX, minY, maxX, maxY]
  }

  getId(): Id {
    return this._id;
  }

  /**
   *
   */
  getBBox(): BBox {
    return this._bbox;
  }

  getWidth(): number {
    return this.getCorner(Item.MAX_X) - this.getCorner(Item.MIN_X)
  }

  getHeight(): number {
    return this.getCorner(Item.MAX_Y) - this.getCorner(Item.MIN_Y)
  }

  setDir(dirEnum: Directions): void {
    this._dir = dirEnum;
    this.setBBox()
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  polygon(): Feature<Polygon, GeoJsonProperties> {
    return bboxPolygon(this._bbox as GeoJSONBBox, this._options)
  }

  /**
   * 判断是否和输入的box相交
   * @param box
   */
  isIntersect(box: BBox): boolean {
    const [ minX, minY, maxX, maxY ] = box
    return minX <= this.maxX || maxX >= this.minX || minY <= this.maxY || maxY >= this.minY
  }
}

export default Item
