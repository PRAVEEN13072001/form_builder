// hooks/useInert.js
import { useEffect } from 'react';

const useInert = (ref, isInert) => {
  useEffect(() => {
    if (ref.current) {
      if (isInert) {
        ref.current.setAttribute('inert', 'true');
      } else {
        ref.current.removeAttribute('inert');
      }
    }
  }, [isInert, ref]);
};

export default useInert;
