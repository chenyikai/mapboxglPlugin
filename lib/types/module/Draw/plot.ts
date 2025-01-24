import { MapEventType } from "mapbox-gl";

export type PlotEvent = 'hover' | 'hoverend' | 'click';

export type eventType = 'create' | 'update' | 'resident' | 'focus';

export type customEvent = 'pointMove'

export type PlotEventKey = MapEventType | customEvent;

export type plotEvent = {
  [key in eventType]: Partial<{
    [key in PlotEventKey]: (e: any) => void;
  }>
};


// export type Focus
