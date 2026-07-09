/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

function useHasVerticalScroll(ref: React.RefObject<HTMLElement>) {
    const [hasScroll, setHasScroll] = useState(false);

    const checkScroll = () => {
      const el = ref.current;
      if (el) {
        const result = el.scrollHeight > el.clientHeight;
        setHasScroll(result);
      }
    };

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      checkScroll();

      const mutationObserver = new MutationObserver(checkScroll);
      mutationObserver.observe(el, { childList: true, subtree: true });

      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(el);

      window.addEventListener("resize", checkScroll);

      return () => {
        mutationObserver.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("resize", checkScroll);
      };
    }, [ref]);

    return hasScroll;
  }

  export default useHasVerticalScroll