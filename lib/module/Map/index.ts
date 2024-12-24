import EventEmitter from "eventemitter3";
import type { MapOptions } from "mapbox-gl";
import { Map, Popup } from "mapbox-gl";
import type { icon, customPopupOptions, InfoFormConfig } from "types/module/Map"
import { isNull } from 'lib/utils/validate'


class MapBox extends EventEmitter {
  // 地图实例
  _map: Map
  options: MapOptions

  _cache: Set<Function> = new Set()
  _mapTimer: number | null = null;

  constructor(options: MapOptions) {
    super();

    this.options = options
    this._map = new Map(options)
    this._map.once('load', this._onLoad)
  }

  _onLoad(): void {
    this.emit('loaded');
  }

  getMap(): Map {
    return this._map;
  }

  home() {
    if(this.options.center) {
      this.getMap().setCenter(this.options.center);
    }
    if(this.options.zoom != null) {
      this.getMap().setZoom(this.options.zoom);
    }
  }

  zoomIn() {
    if (!this.getMap().isZooming()) {
      this.getMap().zoomIn();
    }
  }

  zoomOut() {
    if (!this.getMap().isZooming()) {
      this.getMap().zoomOut();
    }
  }

  addIcons(icons: Array<icon> | icon): Promise<Map>{
    return new Promise((resolve, reject) => {
      if (Array.isArray(icons)) {
        icons.forEach(({ url, name }) => {
          this.getMap().loadImage(url, (err, image) => {
            if (err) return reject(err);
            if (!this.getMap().hasImage(name)) {
              this.getMap().addImage(name, image as ImageBitmap | HTMLImageElement | ImageData);
            }
          });
        });
      } else {
        this.getMap().loadImage(icons.url, (err, image) => {
          if (err) return reject(err);
          if (!this.getMap().hasImage(icons.name)) {
            this.getMap().addImage(icons.name, image as ImageBitmap | HTMLImageElement | ImageData);
          }
        });
      }
      resolve(this.getMap());
    });
  }

  mapLoaded(): Promise<Map> {
    const load = (resolve: Function) => {
      if (!this.getMap()?._loaded) {
        if (!this._mapTimer) {
          this._mapTimer = setInterval(() => {
            load(resolve);
          }, 16);
        } else {
          this._cache.add(resolve);
        }
      } else {
        this._mapTimer && clearInterval(this._mapTimer);
        this._mapTimer = null;
        if (this._cache.size > 0) {
          this._cache.forEach((cb): void => cb(this.getMap()));
          this._cache.clear();
        }

        resolve(this.getMap());
      }
    };

    return new Promise((resolve, reject) => {
      try {
        load(resolve);
      } catch (e) {
        this._mapTimer && clearInterval(this._mapTimer);
        this._mapTimer = null;
        reject(e);
      }
    });
  }

  destroy(): void {
    this.getMap()._controls.forEach((control) => this.getMap().removeControl(control));

    this.getMap() && this.getMap().remove();

    this._mapTimer && clearInterval(this._mapTimer);
    this._mapTimer = null;
  }

  addPopup(options: customPopupOptions): Popup {
    let htmlStr = "";
    const getFormValue = (config: InfoFormConfig, data: any) => {
      if (isNull(config.format)) {
        const result = data[config.prop];
        return isNull(result) ? "暂无数据" : result;
      } else {
        return config.format({
          value: data[config.prop],
          data: data,
        });
      }
    };
    options.config.forEach((item) => {
      htmlStr += `
          <div class="info-form-item">
            <div class="info-label">
                ${item.label}：
            </div>
            <div class="info-value">
              ${getFormValue(item, options.data)}
            </div>
          </div>
        `;
    });
    const html = `
        <div class="info-form">
          ${htmlStr}
        </div>
  `;

    return new Popup({
      ...options,
      className: "info-popup",
    })
        .setLngLat(options.center)
        .setHTML(options.template || html)
        .addTo(this.getMap());
  }
}

export default MapBox
