function formatInt16(value: number | string, integerDigits = 0, fractional = 0): number {
  let parsed = Number(value);
  if (Number.isNaN(parsed)) return -1;

  if (integerDigits > 0) {
    const strValue = parsed.toString();
    parsed = Number(strValue.substring(strValue.length - integerDigits - fractional));
  }

  if (fractional > 0) {
    parsed = parsed / Math.pow(10, fractional);
  }

  return parsed;
}

function int16ToBool(value?: number): boolean {
  return value == 1 ? true : false;
}

function convertRSSIToRange(rssi: number): number {
  if (rssi >= -5) return 0;
  const range = -100 - -61;
  const valueInRange = rssi - -61;
  const percentage = valueInRange / range;
  const rangeSegment = Math.ceil(percentage * 4);
  const result = 5 - rangeSegment;
  return result <= 0 ? 0 : result >= 4 ? 4 : result;
}

export { formatInt16, int16ToBool, convertRSSIToRange };
