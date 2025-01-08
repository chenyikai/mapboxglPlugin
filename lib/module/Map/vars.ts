import type { StyleSpecification } from 'mapbox-gl'
import Layer from "lib/module/Layer";

export const landStyle: StyleSpecification = {
  version: 8,
  name: "Basic",
  glyphs: "https://objects.aochensoft.com/oss/{fontstack}/{range}.pbf",
  sources: {
    base: {
      tiles: [
        // "http://t0.tianditu.gov.cn/vec_w/wmts?tk=645d596e234d96fb5b919937f46c9a00",
        `http://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
      ],
      type: "raster",
      tileSize: 256,
      minzoom: 0,
      maxzoom: 17,
    },
    label: {
      tiles: [
        // "http://t0.tianditu.gov.cn/cva_w/wmts?tk=645d596e234d96fb5b919937f46c9a00",
        `http://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
      ],
      type: "raster",
      tileSize: 256,
      minzoom: 0,
      maxzoom: 217,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "rgba(212,234,238,1)",
      },
    },
    {
      id: "base_layer",
      source: "base",
      type: "raster",
    },
    {
      id: "label_layer",
      source: "label",
      type: "raster",
    },
    {
      id: 'base-end',
      type: 'background',
      paint: {
        // 'background-color': '#000',
        'background-color': 'transparent',
      },
    },
    {
      id: Layer.DIVIDER,
      type: 'background',
      paint: {
        // 'background-color': '#000',
        'background-color': 'transparent',
      },
    },
  ],
}
