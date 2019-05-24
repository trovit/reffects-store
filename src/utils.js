import _setWith from 'lodash.setwith';

function get(obj, path, defaultValue = null) {
  return String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue),
      obj
    );
}

function deepClone(obj) {
  const clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj) && obj.length) {
    return (clone.length = obj.length) && Array.from(clone);
  }
  return Array.isArray(obj) ? Array.from(obj) : clone;
}

export const getIn = (state, path, defaultValue) => {
  return get(state, path, defaultValue);
};

export const setIn = (state, path, valueToSet) => {
  return _setWith({ ...state }, path, valueToSet, deepClone);
};
