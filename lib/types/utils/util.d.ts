import type { Map } from 'mapbox-gl';
interface conversionOptions {
    unit: 'meter' | 'kilometers';
}
export declare function distanceToPx(map: Map, distance: number, options: conversionOptions): number;
export {};
