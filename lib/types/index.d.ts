/// <reference path="./module/Map/index.d.ts" />
/// <reference path="./module/Layer/index.d.ts" />

declare const moduleEnum: {
  readonly Map: 'Map';
  readonly Layer: 'Layer';
}

declare type moduleType = moduleEnum.Map | moduleEnum.Layer

declare interface pluginOptions {
  module: moduleType | Array<moduleType>
}

declare class Plugin {}

export {
  Plugin,
  pluginOptions
}
