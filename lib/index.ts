import type { pluginOptions } from 'types/index'
import MapBox from 'lib/module/Map/index'

class Plugin {
  options: pluginOptions

  constructor(options: pluginOptions) {
    this.options = options;
  }
}

export default Plugin

export {
  MapBox
}
