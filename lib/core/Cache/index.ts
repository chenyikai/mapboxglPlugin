import { CacheItem, CacheOptions, CacheType } from "types/core/Cache/index.ts";
import { isNull } from "lib/utils/validate.ts";

class Cache {

  _options: CacheOptions;
  cacheKey: string;
  cacheType: CacheType;

  constructor(options: CacheOptions) {
    this._options = options;
    this.cacheKey = options.uniqueKey + '-'
    this.cacheType = options.type
  }

  set({ name, content }: { name: string; content: unknown }) {
    const cacheName: string = `${this.cacheKey}${name}`;
    if (typeof content === "function") {
      content = content.toString();
    }
    const obj: CacheItem = {
      dataType: typeof content,
      content: content,
      type: this.cacheType,
      datetime: new Date().getTime(),
    };
    if (this.cacheType === 'sessionstorage') {
      window.sessionStorage.setItem(cacheName, JSON.stringify(obj));
    } else {
      window.localStorage.setItem(cacheName, JSON.stringify(obj));
    }
  }

  get(name: string) {
    const cacheName: string = `${this.cacheKey}${name}`;
    let cacheString: string | null = ''
    if (this.cacheType === 'sessionstorage') {
      cacheString = window.sessionStorage.getItem(cacheName);
    } else if (this.cacheType === 'localstorage') {
      cacheString = window.localStorage.getItem(cacheName);
    }
    if (isNull(cacheString)) {
      console.warn(`未找到缓存，${name}不存在！`);
      return;
    }

    try {
      const cacheObj = JSON.parse(cacheString!) as CacheItem;

      const basicTypes = ["string", "number", "boolean", "object"];
      if (basicTypes.includes(cacheObj.dataType)) {
        return cacheObj.content;
      } else if (cacheObj.dataType === "function") {
        return this.stringParseToFunction(cacheObj.content);
      }
      return cacheObj.content;
    } catch (e) {
      return cacheString;
    }
  }

  delete(name: string) {
    const cacheName: string = `${this.cacheKey}${name}`;
    if (this.cacheType === 'sessionstorage') {
      window.sessionStorage.removeItem(cacheName);
    } else {
      window.localStorage.removeItem(cacheName);
    }
  }

  deleteAll() {
    const list = [];
    if (this.cacheType === 'sessionstorage') {
      for (let i = 0; i <= window.sessionStorage.length; i++) {
        list.push({
          name: window.sessionStorage.key(i),
          content: this.get(<string>window.sessionStorage.key(i)),
        });
      }
    } else {
      for (let i = 0; i <= window.localStorage.length; i++) {
        list.push({
          name: window.localStorage.key(i),
          content: this.get(<string>window.localStorage.key(i)),
        });
      }
    }
    return list;
  };

  /**
   * 把字符串化的函数还原为可执行函数
   * 请确保传入的字符串可信任
   */
  stringParseToFunction(str: any) {
    // eslint-disable-next-line no-new-func
    return new Function('"use strict"; return (' + str + ")")();
  }

}

export default Cache;
