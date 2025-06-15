import { useCallback, useRef, useState } from "react";

export const useInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const setRef = useCallback(
    (node: HTMLDivElement) => {
      const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
            } else {
              setIsInView(false);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.0,
          ...options,
        }
      );

      if (node) {
        observer.observe(node);
      }

      if (ref.current) {
        observer.unobserve(ref.current);
      }
      ref.current = node;
    },
    [options]
  );

  return [setRef, isInView] as const;
};
