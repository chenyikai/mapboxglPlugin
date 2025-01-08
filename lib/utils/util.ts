import type { LayerSpecification, SourceSpecification, Map } from "mapbox-gl";

export function distanceToPx(map: Map, val: number): number {
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

function getRoundNum(num: any) {
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
  if(!map.getLayer(layer.id)) {
    map.addLayer(layer, beforeId)
  }
}
