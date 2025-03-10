import { LngLat } from 'mapbox-gl'

export type Anchor = "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface TooltipOptions {
  id: string | number;
  visible?: boolean;
  className?: string,
  position: LngLat;
  element?: HTMLElement;
  offsetX?: number,
  offsetY?: number,
  anchor?: Anchor
}
