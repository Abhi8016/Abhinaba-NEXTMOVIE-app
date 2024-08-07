import { useRef } from "react";

function useDebounce(cb, delay = 400) {
  const timeoutRef = useRef(null);

  const debounce = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      cb();
    }, delay);
  };

  return debounce;
}

export default useDebounce;

