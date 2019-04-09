import { setIn, getIn } from './storeUtils';

let state = {};
let listeners = [];

export function getState(path = []) {
  return getIn(state, path, state);
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

  const currentListeners = listeners;
  for (let i = 0; i < currentListeners.length; i += 1) {
    currentListeners[i](state);
  }
}

export function subscribe(listener) {
  listeners.push(listener);
}

export function unsubscribe(listener) {
  const out = [];
  for (let i = 0; i < listeners.length; i += 1) {
    if (listeners[i] === listener) {
      listener = null;
    } else {
      out.push(listeners[i]);
    }
  }
  listeners = out;
}

export function initialize(initialState = {}) {
  state = initialState;
}

export function unsubscribeAll() {
  listeners = [];
}
