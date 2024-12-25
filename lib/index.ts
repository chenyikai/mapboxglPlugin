import type { pluginOptions } from "lib/types"
// import MapBox from 'lib/module/Map/index'

class Plugin {
  options: pluginOptions

  constructor(options: pluginOptions) {
    this.options = options;
  }
}

export default Plugin
