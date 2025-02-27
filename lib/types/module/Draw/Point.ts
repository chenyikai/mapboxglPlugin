import { GeoJsonProperties } from "geojson";
import { DataDrivenPropertyValueSpecification } from 'mapbox-gl'
import { PointCoordinates } from "types/module/Draw/Plot.ts";

export interface PointOptions {
  id?: string;
  type: pointType;
  name?: string | number;
  coordinates?: PointCoordinates;
  immediate?: boolean
  properties?: GeoJsonProperties;
  circleStyle?: {
    circleRadius?: number,
    circleColor?: string,
    strokeWidth?: number,
    strokeColor?: string
  };
  iconStyle?: {
    icon: string;
    iconSize?: number;
    anchor?: DataDrivenPropertyValueSpecification<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
    iconRotate?: number;
  };
  indexStyle?: {
    textSize?: number,
    textColor?: string,
    circleRadius?: number,
    circleColor?: string,
    strokeWidth?: number,
    strokeColor?: string
  }
}

export type pointType = 'circle' | 'icon' | 'index';
