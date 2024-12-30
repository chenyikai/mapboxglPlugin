/**
 *
 * @param val 距离 单位：米
 * @return {number}
 */
function getPxByDistance(map, val) {
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

function getRoundNum(num) {
  const pow10 = Math.pow(10, (`${Math.floor(num)}`).length - 1);
  let d = num / pow10;

  d = d >= 10 ? 10 :
      d >= 5 ? 5 :
          d >= 3 ? 3 :
              d >= 2 ? 2 :
                  d >= 1 ? 1 : getDecimalRoundNum(d);

  return pow10 * d;
}

function getDecimalRoundNum(d) {
  const multiplier = Math.pow(10, Math.ceil(-Math.log(d) / Math.LN10));
  return Math.round(d * multiplier) / multiplier;
}
