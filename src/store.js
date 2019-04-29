import { setIn, getIn } from './storeUtils';

let state = {};
let listeners = [];

export function getState(path = []) {
  return getIn(state, path, state);
}

export function executeAllListeners() {
  listeners.forEach(function iterateListeners(currentListener) {
    currentListener(state);
  });
}

export function setState(mutation) {
  if (!mutation) {
    return;
  }

  const { path = [], newValue } = mutation;

  if (!path.length) {
    return;
  }

  state = setIn(state, path, newValue);

  executeAllListeners();
}

export function subscribe(listener) {
  listeners.push(listener);
}

export function unsubscribe(listener) {
  const out = [];

  listeners.forEach(function iterateListeners(currentListener) {
    if (currentListener === listener) {
      listener = null;
    } else {
      out.push(currentListener);
    }
  });

  listeners = out;
}

export function initialize(initialState = {}) {
  state = initialState;
}

export function unsubscribeAll() {
  listeners = [];
}
