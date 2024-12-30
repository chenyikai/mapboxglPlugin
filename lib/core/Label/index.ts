import { LabelOptions, labelData } from 'types/core/Label'
import { Map } from 'mapbox-gl'
import LabelItem from 'lib/core/Label/LabelItem.ts'

class Label {
  _map: Map;
  _options: LabelOptions;
  _ctx: CanvasRenderingContext2D | any;
  labels: Array<labelData> = []
  items: Array<LabelItem> = []

  _repaint = this.repaint.bind(this)

  static LEFT_BOTTOM = 0
  static LEFT_TOP = 1
  static RIGHT_BOTTOM = 2
  static RIGHT_TOP = 3

  constructor(options: LabelOptions) {
    this._map = options.map;
    this._options = options;

    this._map.on('zoom', this._repaint)
    this._map.on('move', this._repaint)

    this._initCanvas()
  }

  get boxSize() {
    const dpr: number = window.devicePixelRatio || 1
    return {
      width: this._map._canvas.width / dpr,
      height: this._map._canvas.height / dpr,
    }
  }

  destroy() {
    this._clearCanvas()
    this._map.off('zoom', this._repaint)
    this._map.off('move', this._repaint)

    const canvas = document.getElementById(this._options.id)
    canvas && canvas.remove()
  }

  add(label: labelData) {
    const labelItem = new LabelItem({ ...this._options, ...label, ctx: this._ctx, dir: LabelItem.BOTTOM_RIGHT })
    labelItem.draw()
    this.labels.push(label)
    this.items.push(labelItem)
    return labelItem
  }

  clear() {
    this._clearCanvas()
    this.labels = []
    this.items = []
    this.repaint()
  }

  load(labels: Array<labelData>) {
    this._clearCanvas()

    this.items = labels.map(label => this.add(label))
    this.labels = labels

    return this.items
  }

  repaint() {
    this._clearCanvas()
    this.items.forEach(item => item.draw())
  }

  _initCanvas() {
    const { width, height } = this.boxSize
    const canvas = document.createElement('canvas');

    canvas.id = this._options.id;
    canvas.style.position = "absolute";
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = "1000";
    canvas.width = width;
    canvas.height = height;
    this._ctx = canvas.getContext("2d")!;

    const container = this._map.getContainer()
    container.style.position = "relative";
    container.appendChild(canvas);
  }

  _clearCanvas() {
    const { width, height } = this.boxSize
    this._ctx.clearRect(0, 0, width, height);
  }
}

export default Label
