function getPathArray(path) {
  return Array.isArray(path) ? path : path.split('.');
}

function get(obj, path, defaultValue = null) {
  return getPathArray(path)
    .filter(Boolean)
    .reduce(
      (a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue),
      obj
    );
}

export const getIn = (state, path, defaultValue) => {
  return get(state, path, defaultValue);
};

export const setIn = (state, path, valueToSet) => {
  return set({ ...state }, path, valueToSet);
};

function set(obj, path, newValue) {
  if (path.length === 0) {
    return obj;
  }
  return getPathArray(path).reduceRight(
    (value, currentPathKey, index, pathKeys) => ({
      ...get(obj, pathKeys.slice(0, index)),
      [currentPathKey]: value,
    }),
    newValue
  );
}
