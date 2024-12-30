import { Id, Directions, LabelItemOptions } from "types/core/Label/Item.ts";
import { labelData } from 'types/core/Label'
import { v4 as uuidV4 } from "uuid";
import { BBox } from 'types/core/Collision/item.ts'

class Item {

  static BOTTOM_LEFT = Directions.BOTTOM_LEFT
  static TOP_LEFT = Directions.TOP_LEFT
  static BOTTOM_RIGHT = Directions.BOTTOM_RIGHT
  static TOP_RIGHT = Directions.TOP_RIGHT

  _options: LabelItemOptions & labelData;

  dir: Directions = Directions.BOTTOM_LEFT

  _ctx: CanvasRenderingContext2D | any;

  _id: Id;

  _bbox: BBox = [0, 0, 0, 0]

  constructor(options: LabelItemOptions & labelData) {
    this._options = options
    this._ctx = options.ctx
    this.dir = options.dir
    this._id = this._options?.id || uuidV4()
  }

  get ex() {
    return this._options.ex || 20
  }

  get ey() {
    return this._options.ey || 20
  }

  get padding() {
    return this._options.padding || 5
  }

  get point() {
    return this._options.map.project(this._options.position)
  }

  get bbox() {
    if (this.dir === Item.BOTTOM_LEFT) {
      return [0, 0, 0, this.point.y]
    }
  }

  get ID() {
    return this._id
  }

  setDir(dir: Directions) {
    this.dir = dir
    this.draw()
  }

  draw() {
    this._line()
    const { width, height } = this._text();
    this._bbox = this._rect(width, height)
    console.log(this._bbox, '_bbox');
  }

  _line() {
    this._ctx.beginPath();

    this._ctx.moveTo(this.point.x, this.point.y);
    if (this.dir === Item.BOTTOM_LEFT) {
      this._ctx.lineTo(this.point.x + this.ex, this.point.y - this.ey);
    } else if (this.dir === Item.BOTTOM_RIGHT) {
      this._ctx.lineTo(this.point.x - this.ex, this.point.y - this.ey);
    } else if (this.dir === Item.TOP_LEFT) {
      this._ctx.lineTo(this.point.x + this.ex, this.point.y + this.ey);
    } else if (this.dir === Item.TOP_RIGHT) {
      this._ctx.lineTo(this.point.x - this.ex, this.point.y + this.ey);
    } else {
      throw new Error(`Unsupported dir: ${this.dir}`);
    }

    this._ctx.lineWidth = 2;
    this._ctx.strokeStyle = "#000";
    this._ctx.stroke();
  }

  _text() {
    this._ctx.font = "14px serif";
    this._ctx.textAlign = 'center';

    const {
      actualBoundingBoxRight,
      actualBoundingBoxLeft,
      actualBoundingBoxAscent,
      actualBoundingBoxDescent
    }: TextMetrics = this._ctx.measureText(this._options.info)
    const width = actualBoundingBoxRight + actualBoundingBoxLeft
    const height = actualBoundingBoxAscent + actualBoundingBoxDescent
    // this._ctx.textBaseline = 'bottom';
    if (this.dir === Item.BOTTOM_LEFT) {
      this._ctx.fillText(this._options.info, this.point.x + this.ex + this.padding, this.point.y - this.ey - this.padding);
    } else if (this.dir === Item.BOTTOM_RIGHT) {
      this._ctx.fillText(this._options.info, this.point.x - this.ex - this.padding, this.point.y - this.ey - this.padding);
    } else if (this.dir === Item.TOP_LEFT) {
      this._ctx.fillText(this._options.info, this.point.x + this.ex + this.padding, this.point.y + this.ey + this.padding + height);
    } else if (this.dir === Item.TOP_RIGHT) {
      this._ctx.fillText(this._options.info, this.point.x - this.ex - this.padding, this.point.y + this.ey + this.padding + height);
    } else {
      throw new Error(`Unsupported dir: ${this.dir}`);
    }
    return { width, height };
  }

  _rect(width: number, height: number): BBox {
    let _width = width + this.padding * 2;
    let _height = height + this.padding * 2;
    let x = 0;
    let y = 0;
    if (this.dir === Item.BOTTOM_LEFT) {
      x = this.point.x + this.ex - width / 2;
      y = this.point.y - this.ey - (height + this.padding * 2);
    } else if (this.dir === Item.BOTTOM_RIGHT) {
      x = this.point.x - this.ex - width / 2 - this.padding * 2;
      y = this.point.y - this.ey - (height + this.padding * 2);
    } else if (this.dir === Item.TOP_LEFT) {
      x = this.point.x + this.ex - width / 2;
      y = this.point.y + this.ey;
    } else if (this.dir === Item.TOP_RIGHT) {
      x = this.point.x - this.ex - width / 2 - this.padding * 2;
      y = this.point.y + this.ey;
    } else {
      throw new Error(`Unsupported dir: ${this.dir}`);
    }

    this._ctx.strokeRect(x, y, _width, _height);
    return [x, y, x + _width, y + _height];
  }
}

export default Item
