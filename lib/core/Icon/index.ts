import type { Map } from 'mapbox-gl'
import { icon, result, RESULT_CODE } from "types/core/Icon";

class Icon {
  _map: Map

  static SUCCESS = RESULT_CODE.SUCCESS
  static FAIL = RESULT_CODE.FAIL

  constructor(map: Map) {
    this._map = map;
  }

  load(icons: Array<icon>): Promise<{ success: Array<result>, error: Array<result> }> {
    return new Promise((resolve) => {
      Promise.allSettled(icons.map(icon => this.add(icon))).then((data) => {
        const success: Array<result> = []
        const error: Array<result> = []
        data.forEach(item => {
          if (item.status === 'rejected') {
            error.push(item.reason)
          } else if (item.status === 'fulfilled') {
            success.push(item.value)
          }
        })

        resolve({ success, error })
      })
    })
  }

  add(icon: icon): Promise<result> {
    return new Promise((resolve, reject) => {
      this._map.loadImage(icon.url, (err, image) => {
        if (err) {
          return reject(this.error(icon, err));
        }

        if (this._map.hasImage(icon.name)) {
          return reject(this.error(icon, 'The image has been loaded！'));
        }

        this._map.addImage(icon.name, image as ImageBitmap | HTMLImageElement | ImageData, icon.options);
        resolve(this.success(icon));
      });
    })
  }

  update(icon: icon): Promise<result> {
    return new Promise((resolve, reject) => {
      if (!this._map.hasImage(icon.name)) {
        return reject(this.error(icon, 'The image has not been loaded！'));
      }

      this._map.loadImage(icon.url, (err, image) => {
        if (err) {
          return reject(this.error(icon, err));
        }

        this._map.updateImage(icon.name, image as ImageBitmap | HTMLImageElement | ImageData);
        resolve(this.success(icon));
      });
    })
  }

  delete(name: string) {
    if (this._map.hasImage(name)) {
      this._map.removeImage(name);
    }
  }

  success(icon: icon): result {
    return {
      code: Icon.SUCCESS,
      data: icon,
      msg: `The ${icon.name} was successfully added`
    }
  }

  error(icon: icon, err: string | Error | null | undefined): result {
    return {
      code: Icon.FAIL,
      data: icon,
      msg: icon.name + err
    }
  }
}

export default Icon;
