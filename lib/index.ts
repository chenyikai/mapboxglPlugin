import type { pluginOptions } from 'types/index'

class Plugin {
  options: pluginOptions

  constructor(options: pluginOptions) {
    this.options = options;
  }
}

export default Plugin
