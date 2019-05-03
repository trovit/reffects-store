import * as store from './store';

afterEach(() => {
  store.initialize();
  store.unsubscribeAll();
});

describe('extracting values from the store', () => {
  test('using a path with no nesting', () => {
    store.initialize({ koko: 'loko' });

    expect(store.getState(['koko'])).toEqual('loko');
    expect(store.getState('koko')).toEqual('loko');
  });

  test('using a path with some nesting', () => {
    store.initialize({ koko: { loko: { moko: 'poko' } } });

    expect(store.getState(['koko', 'loko', 'moko'])).toEqual('poko');
    expect(store.getState('koko.loko.moko')).toEqual('poko');
  });

  test('using an empty path or no path', () => {
    const state = { koko: { loko: { moko: 'poko' } } };
    store.initialize(state);

    expect(store.getState([])).toEqual(state);
    expect(store.getState()).toEqual(state);
  });
});

describe('mutating values in the store', () => {
  test('using a path with no nesting represented as an array', () => {
    const newValue = 'lolo';
    const path = ['koko'];
    store.initialize({ koko: 'loko' });

    store.setState({ path, newValue });

    expect(store.getState(path)).toEqual(newValue);
  });

  test('using a path with no nesting represented as a string', () => {
    const newValue = 'lolo';
    const path = 'koko';
    store.initialize({ koko: 'loko' });

    store.setState({ path, newValue });

    expect(store.getState(path)).toEqual(newValue);
  });

  test('using a path with some nesting represented as an array', () => {
    const newValue = 'lolo';
    const path = ['koko', 'loko', 'moko'];
    store.initialize({ koko: { loko: { moko: 'poko' } } });

    store.setState({ path, newValue });

    expect(store.getState(path)).toEqual(newValue);
  });

  test('using a path with some nesting represented as a string', () => {
    const newValue = 'lolo';
    const path = 'koko.loko.moko';
    store.initialize({ koko: { loko: { moko: 'poko' } } });

    store.setState({ path, newValue });

    expect(store.getState(path)).toEqual(newValue);
  });

  test('using a path which does not exist, adds the new value anyway', () => {
    const state = { koko: { loko: { moko: 'poko' } } };
    const newValue = 'lolo';
    const path = 'koko.loko.pepe';
    store.initialize(state);

    store.setState({ path, newValue });

    expect(store.getState(path)).toEqual(newValue);

    expect(store.getState()).toEqual({
      koko: { loko: { moko: 'poko', pepe: 'lolo' } },
    });
  });

  test('using no mutation does nothing', () => {
    const state = { koko: { loko: { moko: 'poko' } } };
    store.initialize(state);

    expect(() => store.setState()).toThrow(new Error('No mutation'));
    expect(store.getState()).toEqual(state);
  });

  test('using an empty mutation does nothing', () => {
    const state = { koko: { loko: { moko: 'poko' } } };
    store.initialize(state, 'anyValue');

    expect(() => store.setState({})).toThrow(
      new Error('Empty path in mutation')
    );
    expect(store.getState()).toEqual(state);
  });

  test('using a mutation with no path does nothing', () => {
    const state = { koko: { loko: { moko: 'poko' } } };
    store.initialize(state, 'anyValue');

    expect(() => store.setState({ newValue: 42 })).toThrow(
      new Error('Empty path in mutation')
    );

    expect(store.getState()).toEqual(state);
  });
});

describe('subscriptions to store changes', () => {
  test('subscribing to store changes', () => {
    const newValue = 'lolo';
    const path = ['koko'];
    store.initialize({ koko: 'loko' });
    const fn = jest.fn(newState => expect(newState).toEqual({ koko: newValue }));

    store.subscribe(fn);
    store.setState({ path, newValue });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('unsubscribing from store changes', () => {
    const newValue = 'lolo';
    const path = ['koko'];
    store.initialize({ koko: 'loko' });
    const spyToBeUnsubscribed = jest.fn();
    const spyNotUnsubscribed = jest.fn();

    store.subscribe(spyNotUnsubscribed);
    store.subscribe(spyToBeUnsubscribed);
    store.unsubscribe(spyToBeUnsubscribed);
    store.setState({ path, newValue });

    expect(spyToBeUnsubscribed).toHaveBeenCalledTimes(0);
    expect(spyNotUnsubscribed).toHaveBeenCalledTimes(1);
  });
});
