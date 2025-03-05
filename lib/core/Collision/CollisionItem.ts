import { Scopes, CollisionItemOptions } from 'types/core/Collision/item'
import { BBox } from 'rbush'
import { Anchor } from "types/core/Toolip";

class CollisionItem {
  // 最小X
  static MIN_X: Scopes = Scopes.MIN_X;
  // 最小Y
  static MIN_Y: Scopes = Scopes.MIN_Y;
  // 最大X
  static MAX_X: Scopes = Scopes.MAX_X;
  // 最大Y
  static MAX_Y: Scopes = Scopes.MAX_Y;

  id: CollisionItemOptions['id'];

  visible: boolean = true

  dir: Anchor = 'top-left'

  dirs: Array<Anchor> = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    // 'center',
    'top',
    'bottom',
    'left',
    'right',
  ]

  _options: CollisionItemOptions

  /**
   *
   * @param options
   */
  constructor(options: CollisionItemOptions) {
    this.id = options.id;
    this._options = options;
  }

  get minX(): number {
    return this._options[this.dir].minX
  }

  get minY(): number {
    return this._options[this.dir].minY
  }

  get maxX(): number {
    return this._options[this.dir].maxX
  }

  get maxY(): number {
    return this._options[this.dir].maxY
  }

  /**
   *
   */
  getBBox(): BBox {
    return this._options[this.dir];
  }

  /**
   * 设置是否显示
   * @param visible
   */
  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  setDir(dir: Anchor) {
    this.dir = dir;
  }

  /**
   * 判断item与box是否相交
   * @param box
   * @return true-相交 false-不相交
   */
  isIntersect(box: BBox): boolean {
    const { minX, minY, maxX, maxY } = box
    return minX <= this.minX && minY <= this.minY && this.maxX <= maxX && this.maxY <= maxY;
  }
}

export default CollisionItem
