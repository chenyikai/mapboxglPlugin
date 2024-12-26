import type { MapOptions, PopupOptions, LngLatLike } from "mapbox-gl";

export enum MapType {
    LAND = 'land',
    SATELLITE = 'satellite'
}

export interface formatOptions  {
    value: string | number;
    data: object
}

export interface InfoFormConfig {
    label: string | number;

    prop: string | number;

    format(formatOptions: formatOptions): string;
}

export type customPopupOptions  = PopupOptions & {
    center: LngLatLike;

    config: Array<InfoFormConfig>;

    data: object;

    template: string;
}

export type CustomMapOptions = MapOptions & {
    type?: MapType;
}
