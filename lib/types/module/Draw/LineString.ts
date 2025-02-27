import { GeoJsonProperties } from "geojson";

export type lineStringType = 'circle' | 'index' | 'arrow';

export type lineStringItem = [number, number];

export interface LineStringOptions {
  id?: string;
  type: lineStringType;
  name?: string | number;
  coordinates?: Array<lineStringItem>;
  immediate?: boolean
  properties?: GeoJsonProperties;
}
