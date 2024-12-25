import EventEmitter from "eventemitter3";
import { Map, Popup } from "mapbox-gl";
import { icon, customPopupOptions, CustomMapOptions } from "types/module/Map";
declare class MapBox extends EventEmitter {
    _map: Map;
    options: CustomMapOptions | undefined;
    _cache: Set<Function>;
    _mapTimer: number | null;
    _load: Function;
    constructor(options: CustomMapOptions);
    _setOptions(options: CustomMapOptions): void;
    _onLoad(): void;
    getMap(): Map;
    home(): void;
    zoomIn(): void;
    zoomOut(): void;
    addIcons(icons: Array<icon> | icon): Promise<Map>;
    mapLoaded(): Promise<Map>;
    destroy(): void;
    addPopup(options: customPopupOptions): Popup;
}
export default MapBox;
