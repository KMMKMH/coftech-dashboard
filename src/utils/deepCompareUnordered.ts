import isEqual from "lodash/isEqual";

const normalizeValue = (value: any): any => {
  if (Array.isArray(value)) {
    return value
      .map(normalizeValue)
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }

  if (value !== null && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = normalizeValue(value[key]);
        return acc;
      }, {} as Record<string, any>);
  }

  return value;
};

export const deepCompareUnordered = (a: any, b: any): boolean => {
  return isEqual(normalizeValue(a), normalizeValue(b));
};
