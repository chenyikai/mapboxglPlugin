import EventEmitter from 'eventemitter3';
import type { Map } from 'mapbox-gl';
import type { layerOptions, GraphicParameter } from "types/module/Layer";
import type { Feature, FeatureCollection } from "geojson";
declare class Layer extends EventEmitter {
    _map: Map;
    options: layerOptions;
    features: {
        [id: string]: Feature;
    };
    collection: FeatureCollection;
    constructor(map: Map, options: layerOptions);
    _init(): void;
    show(): void;
    hide(val: string): void;
    focus(id: string): void;
    add(graphic: Array<GraphicParameter> | GraphicParameter): Feature | Array<Feature>;
    update(feature: Feature): void;
    delete(id: string): void;
    get(id: string): Feature;
    deleteAll(): void;
    render(): void;
    _createFeature({ id, coordinates, properties }: GraphicParameter): Feature;
}
export default Layer;
