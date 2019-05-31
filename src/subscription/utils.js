import { useReducer, useCallback } from 'react';

const reducer = state => !state;

const useForceUpdate = () => {
  const [, dispatch] = useReducer(reducer, true);

  const memoizedDispatch = useCallback(() => {
    dispatch(null);
  }, [dispatch]);
  return memoizedDispatch;
};

export default useForceUpdate;
