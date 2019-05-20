import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import subscribe from '.';
import * as storeModule from '../store';

configure({ adapter: new Adapter() });

describe('subscriptions', () => {
  function Child() {
    return <div />;
  }

  it('should pass mapped state as props', () => {
    const store = storeModule;
    store.initialize({ a: 'b' });
    const SubscribedChild = subscribe(
      Child,
      state => ({ a: state.a }),
      null,
      store
    );

    const wrapper = mount(<SubscribedChild />);

    const child = wrapper.find(Child).first();
    expect(child.props()).toEqual({
      a: 'b',
    });
  });

  it('should use the store module by default', () => {
    const store = storeModule;
    store.initialize({ a: 'b' });
    const SubscribedChild = subscribe(Child, state => ({ a: state.a }));

    const wrapper = mount(<SubscribedChild />);

    const child = wrapper.find(Child).first();
    expect(child.props()).toEqual({
      a: 'b',
    });
  });

  it('should subscribe and unsubscribe to store', () => {
    const store = storeModule;
    store.initialize({ a: null });
    jest.spyOn(store, 'subscribeListener');
    jest.spyOn(store, 'unsubscribeListener');
    const SubscribedChild = subscribe(
      Child,
      state => ({ a: state.a }),
      null,
      store
    );

    expect(store.subscribeListener).not.toHaveBeenCalled();
    const mountedProvider = mount(<SubscribedChild />);

    expect(store.subscribeListener).toBeCalledWith(expect.any(Function));

    store.setState({ path: ['a'], newValue: 'b' });

    expect(store.unsubscribeListener).not.toHaveBeenCalled();
    mountedProvider.unmount();
    expect(store.unsubscribeListener).toBeCalled();
  });

  it('should call force update when the state changes', () => {
    const store = storeModule;
    store.initialize({ a: null });
    let numCalls = 0;
    const SubscribedChild = subscribe(
      Child,
      state => ({ a: state.a }),
      null,
      store
    );

    const wrapper = mount(<SubscribedChild />);

    wrapper.instance().forceUpdate = () => {
      numCalls += 1;
    };

    expect(numCalls).toBe(0);

    store.setState({ path: ['a'], newValue: 'b' });

    expect(numCalls).toBe(1);
  });

  it("shouldn't call force update when the state is the same", () => {
    const store = storeModule;
    store.initialize({ a: 1 });
    let numCalls = 0;
    const SubscribedChild = subscribe(
      Child,
      state => ({ a: state.a }),
      null,
      store
    );

    const wrapper = mount(<SubscribedChild />);

    wrapper.instance().forceUpdate = () => {
      numCalls += 1;
    };

    expect(numCalls).toBe(0);

    store.setState({ path: ['a'], newValue: 1 });

    expect(numCalls).toBe(0);
  });

  it('should call force update when the parent pass new props', () => {
    const store = storeModule;
    store.initialize({ a: null });
    let numCalls = 0;

    const SubscribedChild = subscribe(
      Child,
      (state, ownProps) => ({ a: state.a, b: ownProps.b }),
      null,
      store
    );

    function Parent({ b }) {
      return <SubscribedChild b={b} />;
    }

    const wrapper = mount(<Parent b={'a'} />);

    wrapper.find(SubscribedChild).instance().forceUpdate = () => {
      numCalls += 1;
    };

    expect(numCalls).toBe(0);

    wrapper.setProps({ b: 'koko' });

    expect(numCalls).toBe(1);
  });

  it('should return a Component with injected props if some are passed in', () => {
    const expectedProps = { a: 'loko' };

    const SubscribedChild = subscribe(Child, () => {}, { a: 'loko' });
    const wrapper = mount(<SubscribedChild />);
    const props = wrapper.find(Child).props();

    expect(props).toMatchObject(expectedProps);
  });

  it('should return a Component with injected props if some are passed in, and prevail any other prop', () => {
    const store = storeModule;
    store.initialize({ a: 'koko' });
    const expectedProps = { a: 'moko' };

    const SubscribedChild = subscribe(
      Child,
      state => ({
        a: state.a,
      }),
      { a: 'moko' },
      store
    );
    const wrapper = mount(<SubscribedChild a={'loko'} />);
    const props = wrapper.find(Child).props();

    expect(props).toMatchObject(expectedProps);
  });
});
