import type { GeoJsonProperties } from "geojson";

declare type icon = {
  name: string;
  url: string;
}

declare interface layerOptions {
  icons?: Array<icon>;
}

declare interface GraphicParameter {
  id: string;
  coordinates: string;
  properties: GeoJsonProperties
}

declare class Layer {}

export {
  Layer,
  layerOptions,
  GraphicParameter
}
