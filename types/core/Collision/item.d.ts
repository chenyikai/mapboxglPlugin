import { Point } from 'mapbox-gl';
import { Feature, Polygon, GeoJsonProperties } from "geojson";
import { BBox, Id, Directions, Scopes, ItemOptions } from 'types/core/Collision/item';
declare class Item {
    visible: boolean;
    _position: Point;
    _expand: {
        x: number;
        y: number;
    };
    _width: number;
    _height: number;
    _bbox: BBox;
    _dir: Directions | undefined;
    _options: ItemOptions["options"] | undefined;
    _id: Id;
    static TOP_LEFT: Directions;
    static TOP_RIGHT: Directions;
    static BOTTOM_RIGHT: Directions;
    static BOTTOM_LEFT: Directions;
    static MIN_X: Scopes;
    static MIN_Y: Scopes;
    static MAX_X: Scopes;
    static MAX_Y: Scopes;
    /**
     *
     * @param config
     */
    constructor(config: ItemOptions);
    _init({ position, width, height, dir, expand, options }: ItemOptions): void;
    get minX(): number;
    get minY(): number;
    get maxX(): number;
    get maxY(): number;
    setBBox(): void;
    getId(): Id;
    /**
     *
     */
    getBBox(): BBox;
    /**
     * 设置方向
     * @param dirEnum 方向枚举
     */
    setDir(dirEnum: Directions): void;
    /**
     * 设置是否显示
     * @param visible
     */
    setVisible(visible: boolean): void;
    polygon(): Feature<Polygon, GeoJsonProperties>;
    /**
     * 判断item与box是否相交
     * @param box
     * @return true-相交 false-不相交
     */
    isIntersect(box: BBox): boolean;
}
export default Item;
