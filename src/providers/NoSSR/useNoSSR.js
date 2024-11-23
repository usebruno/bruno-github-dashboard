import { useEffect } from 'react';

const useNoSSR = (callback) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      callback();
    }
  }, [callback]);
};

export default useNoSSR;