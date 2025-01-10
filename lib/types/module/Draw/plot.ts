import { MapMouseEvent, MapMouseEventType } from "mapbox-gl";

export type eventType = 'create' | 'update' | 'resident';

export type customEvent = 'pointMove'

export type plotEvent = {
  [key in eventType]: Partial<{
    [key in MapMouseEventType | customEvent]: (e: MapMouseEvent) => void;
  }>
};
