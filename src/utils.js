import _clone from 'lodash.clone';
import _setWith from 'lodash.setwith';

const get = (obj, path, defaultValue = null) =>
  String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue),
      obj
    );

export const getIn = (state, path, defaultValue) => {
  return get(state, path, defaultValue);
};

export const setIn = (state, path, valueToSet) => {
  return _setWith({ ...state }, path, valueToSet, nsValue => {
    return _clone(nsValue);
  });
};
