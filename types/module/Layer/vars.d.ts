import { LayerSpecification } from "mapbox-gl";
export declare enum LAYER_ENUM {
    SOURCE = "mapboxgl-layer-source",
    POLYGON_LAYER_NAME = "mapboxgl-polygon-layer",
    LINE_LAYER_NAME = "mapbox-line-layer",
    OUTLINE_LAYER_NAME = "mapbox-outline-layer",
    POINT_LAYER_NAME = "mapbox-point-layer"
}
declare const OUTLINE_LAYER: LayerSpecification;
declare const FILL_LAYER: LayerSpecification;
declare const LINE_LAYER: LayerSpecification;
export { OUTLINE_LAYER, FILL_LAYER, LINE_LAYER };
