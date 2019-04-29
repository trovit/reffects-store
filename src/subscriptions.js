import { createElement, Component } from 'react';
import * as storeModule from './store';

export default function subscribe(mapStateToProps, store = storeModule) {
  return Child => {
    function Wrapper(props) {
      Component.call(this, props);
      let currentMappedProps = mapStateToProps(store.getState(), props);

      const update = () => {
        const nextMappedProps = mapStateToProps(store.getState(), props);

        // compares the current derived state props against the current state props
        for (const i in nextMappedProps) {
          if (nextMappedProps[i] !== currentMappedProps[i]) {
            currentMappedProps = nextMappedProps;
            return this.forceUpdate();
          }
        }
      };
      this.UNSAFE_componentWillReceiveProps = p => {
        props = p;
        update();
      };
      this.componentDidMount = () => {
        store.subscribe(update);
      };
      this.componentWillUnmount = () => {
        store.unsubscribe(update);
      };
      this.render = () =>
        createElement(Child, { ...this.props, ...currentMappedProps });
    }

    return ((Wrapper.prototype = Object.create(
      Component.prototype
    )).constructor = Wrapper);
  };
}
