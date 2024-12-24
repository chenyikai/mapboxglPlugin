import type { Map, MapOptions, Popup, PopupOptions, LngLatLike } from "mapbox-gl";
import EventEmitter from "eventemitter3";

declare interface icon {
    name: string;
    url: string;
}

declare interface formatOptions  {
    value: string | number;
    data: object
}

declare interface InfoFormConfig {
    label: string | number;

    prop: string | number;

    format(formatOptions: formatOptions): string;
}

declare type customPopupOptions  = PopupOptions & {
    center: LngLatLike;

    config: Array<InfoFormConfig>;

    data: object;

    template: string;
}

declare class MapBox extends EventEmitter {
    // 地图对象
    _map: Map;
    // 地图初始化参数
    options: MapOptions;
    // 地图load事件缓存
    _cache: Set<Function>;
    // 地图load计时器
    _mapTimer: number | null

    constructor(options: MapOptions);

    /**
     * 地图load事件
     */
    _onLoad(): void;

    /**
     * 获取地图对象
     */
    getMap(): Map;

    /**
     * 地图位置归位初始化状态
     */
    home(): void;

    /**
     * 加载地图icon
     * @param icons { Array<icon> }
     */
    addIcons(icons: Array<icon>): Promise<void>

    /**
     * 地图是否加载结束
     */
    mapLoaded(): Promise<Map>

    /**
     * 添加popup
     */
    addPopup(): Popup;

    /**
     * 地图销毁
     */
    destroy(): void
}

export {
    MapBox,
    icon,
    customPopupOptions,
    InfoFormConfig
}
