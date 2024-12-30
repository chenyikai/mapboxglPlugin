import { Map, LngLatLike } from "mapbox-gl";

export interface LabelOptions {
  map: Map,
  id: string,
  ex?: number,
  ey?: number,
  padding?: number
}

export interface labelData {
  position: LngLatLike,
  info: string,
  style?: {
    fontSize: number;
    color: string
  }
}
