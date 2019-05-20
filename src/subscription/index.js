import { createElement, memo, useEffect, useState } from 'react';
import * as storeModule from '../store';

function subscribe(
  ComponentToSubscribe,
  mapStateToProps,
  injectedProps = {},
  store = storeModule
) {
  function subscribeChild(Child) {
    function Subscriber(props) {
      const [currentMappedProps, forceUpdate] = useState(
        mapStateToProps(store.getState(), props)
      );

      function update() {
        const nextMappedProps = mapStateToProps(store.getState(), props);

        // Compares the current derived state props against the current state props
        for (const i in nextMappedProps) {
          if (nextMappedProps[i] !== currentMappedProps[i]) {
            forceUpdate(nextMappedProps);
          }
        }
      }

      // Will receive props
      useEffect(() => {
        update();
      }, [props]);

      useEffect(() => {
        // Did mount
        store.subscribeListener(update);

        // Will unmount
        return () => store.unsubscribeListener(update);
      }, []);

      return createElement(Child, {
        ...props,
        ...currentMappedProps,
        ...injectedProps,
      });
    }

    return memo(Subscriber);
  }

  return subscribeChild(ComponentToSubscribe);
}

export default subscribe;
