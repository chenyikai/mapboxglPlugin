import { MapMouseEvent, MapMouseEventType, MapEvents } from "mapbox-gl";

export type PlotEvent = 'hover' | 'hoverend' | 'click';

export type eventType = 'create' | 'update' | 'resident';

export type customEvent = 'pointMove'

export type plotEvent = {
  [key in eventType]: Partial<{
    [key in MapMouseEventType | customEvent]: (e: MapMouseEvent) => void;
  }>
};

export type EventKey = keyof MapEvents & string;
