import {
  FilterSpecification,
  LayerSpecification,
  SourceSpecification,
  Map,
  LngLatBoundsLike,
  GeoJSONSource
} from "mapbox-gl";
import { EventKey } from "types/module/Draw/plot.ts";
import { v4 as uuidV4 } from 'uuid';
import { lineString, point, rhumbDestination } from "@turf/turf";
import { set } from 'lodash-es';
import { FOCUS_SOURCE_NAME } from "lib/module/Draw/module/vars.ts";

const _listeners: any = {};
const focusData: any = {}

export function distanceToPx(map: Map, val: number) {
  const maxWidth = 100;
  const y = map._containerHeight / 2;
  const x = (map._containerWidth / 2) - maxWidth / 2;
  const left = map.unproject([x, y]);
  const right = map.unproject([x + maxWidth, y]);
  const maxMeters = left.distanceTo(right);

  const distance = getRoundNum(maxMeters);
  const ratio = distance / maxMeters;
  const width = maxWidth * ratio
  return (width / distance) * val
}

function getRoundNum(num: number) {
  const pow10 = Math.pow(10, (`${Math.floor(num)}`).length - 1);
  let d = num / pow10;

  d = d >= 10 ? 10 :
      d >= 5 ? 5 :
          d >= 3 ? 3 :
              d >= 2 ? 2 :
                  d >= 1 ? 1 : getDecimalRoundNum(d);

  return pow10 * d;
}

function getDecimalRoundNum(d: any) {
  const multiplier = Math.pow(10, Math.ceil(-Math.log(d) / Math.LN10));
  return Math.round(d * multiplier) / multiplier;
}

export function addSource(map: Map, id: string, source: SourceSpecification) {
  if (!map.getSource(id)) {
    map.addSource(id, source)
  }
}

export function addLayer(map: Map, layer: LayerSpecification, beforeId?: string) {
  addColdLayer(map, layer, beforeId);
  addHotLayer(map, layer, beforeId);
}

export function addColdLayer(map: Map, layer: LayerSpecification, beforeId?: string) {
  const id = `${layer.id}-cold`;
  if(!map.getLayer(id)) {
    map.addLayer({ ...layer, id }, beforeId)
  }
}

export function addHotLayer(map: Map, layer: LayerSpecification, beforeId?: string) {
  const id = `${layer.id}-hot`;
  if(!map.getLayer(id)) {
    const isHot: FilterSpecification = ["==", "source", "hot"]
    if (Array.isArray(layer.filter)) {
      layer.filter = [...layer.filter, isHot]
    }
    map.addLayer({ ...layer, id }, beforeId)
  }
}


export function banListener(map: Map, keys: EventKey | Array<EventKey>) {
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      _listeners[key] = map._listeners[key];
      map._listeners[key] = [];
    })
  } else {
    _listeners[keys] = map._listeners[keys];
    map._listeners[keys] = [];
  }
}

export function unBanListener(map: Map, keys: EventKey | Array<EventKey>) {
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      map._listeners[key] = _listeners[key];
      _listeners[key] = [];
    })
  } else {
    map._listeners[keys] = _listeners[keys];
    _listeners[keys] = [];
  }
}

export function focus(map: Map, { id, bbox, width }: { id?: string, bbox: LngLatBoundsLike, width: number }) {
  const focusId = id || uuidV4();
  set(focusData, focusId, { id: focusId, bbox, width })
  // @ts-ignore
  const [ minLon, minLat, maxLon, maxLat ] = focusData[focusId].bbox;

  const one = point([minLon, maxLat]);
  const two = point([maxLon, maxLat]);
  const three = point([maxLon, minLat]);
  const four = point([minLon, minLat]);
  const meter = focusData[focusId].width / distanceToPx(map, 1) * 0.3

  const oneCorner = lineString([
    rhumbDestination(one, meter, 90, { units: "meters" }).geometry.coordinates,
    one.geometry.coordinates,
    rhumbDestination(one, meter, 180, { units: "meters" }).geometry.coordinates,
  ], {}, {
    id: focusId + 'one-corner'
  })

  const twoCorner = lineString([
    rhumbDestination(two, meter, 270, { units: "meters" }).geometry.coordinates,
    two.geometry.coordinates,
    rhumbDestination(two, meter, 180, { units: "meters" }).geometry.coordinates,
  ], {}, {
    id: focusId + 'two-corner'
  })

  const threeCorner = lineString([
    rhumbDestination(three, meter, 0, { units: "meters" }).geometry.coordinates,
    three.geometry.coordinates,
    rhumbDestination(three, meter, 270, { units: "meters" }).geometry.coordinates,
  ], {}, {
    id: focusId + 'three-corner'
  })

  const fourCorner = lineString([
    rhumbDestination(four, meter, 0, { units: "meters" }).geometry.coordinates,
    four.geometry.coordinates,
    rhumbDestination(four, meter, 90, { units: "meters" }).geometry.coordinates,
  ], {}, {
    id: focusId + 'four-corner'
  })

  const source: GeoJSONSource | undefined = map.getSource(FOCUS_SOURCE_NAME)
  if (source) {
    source.updateData({
      type: 'FeatureCollection',
      features: [oneCorner, twoCorner, threeCorner, fourCorner],
    })
  }

  return focusId;
}

export function unFocus() {}
