import type { Map, LngLat } from 'mapbox-gl'

interface conversionOptions {
  unit: 'meter' | 'kilometers',
}

export function distanceToPx(map: Map, distance: number, options: conversionOptions) {
  const { unit = 'meter' } = options;
  const maxWidth: number = 100;

  const y: number = map._containerHeight / 2;
  const x: number = (map._containerWidth / 2) - maxWidth / 2;
  const left: LngLat = map.unproject([x, y]);
  const right: LngLat = map.unproject([x + maxWidth, y]);
  const maxMeters: number = left.distanceTo(right);

  const d: number = getRoundNum(maxMeters);
  const ratio: number = d / maxMeters;
  const width: number = maxWidth * ratio

  return (width / distance) * unitConversion(distance, unit)
}

function unitConversion(distance: number, unit: conversionOptions["unit"]) {
  if (unit === 'kilometers') {
    return distance * 1000;
  } else {
    return distance
  }
}

// export function distance2Px() {}

function getRoundNum(num: number): number {
  const pow10: number = Math.pow(10, (`${Math.floor(num)}`).length - 1);
  let d: number = num / pow10;

  d = d >= 10 ? 10 :
      d >= 5 ? 5 :
          d >= 3 ? 3 :
              d >= 2 ? 2 :
                  d >= 1 ? 1 : getDecimalRoundNum(d);

  return pow10 * d;
}

function getDecimalRoundNum(d: number): number {
  const multiplier: number = Math.pow(10, Math.ceil(-Math.log(d) / Math.LN10));
  return Math.round(d * multiplier) / multiplier;
}
