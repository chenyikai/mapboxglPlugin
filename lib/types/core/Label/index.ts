import { LngLat } from "mapbox-gl";

export interface LabelOptions {
  id: string,
  ex?: number,
  ey?: number,
  padding?: number
}

export interface labelData {
  position: LngLat,
  info: string,
  style?: {
    fontSize: number;
    color: string
  }
}
