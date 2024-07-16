function smallestDifferenceFromTarget(
  target: number,
  valuesArray: number[],
  singleUse: boolean = false
) {
  let smallestDifference = 5;
  const k = singleUse ? 1 : 0; // to include or not the same number
  for (let i = 0; i < valuesArray.length; i++) {
    for (let j = i + k; j < valuesArray.length; j++) {
      const product = valuesArray[i] * valuesArray[j];
      const difference = Math.abs(target - product);
      if (difference === 0) {
        return 0;
      }
      if (difference < smallestDifference) {
        smallestDifference = difference;
      }
    }
  }
  return smallestDifference;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

function clampIntInRange(number: number, range: [number, number]) {
  const [min, max] = range;
  const roundedNumber = Math.round(number);
  if (roundedNumber < min) {
    return min;
  } else if (roundedNumber > max) {
    return max;
  } else {
    return roundedNumber;
  }
}

export {
  smallestDifferenceFromTarget,
  getRandomInt,
  gaussianRandom,
  clampIntInRange,
};
