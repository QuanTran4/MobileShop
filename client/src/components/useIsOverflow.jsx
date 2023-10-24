import * as React from "react";

const useIsOverflow = (ref, isVerticalOverflow, callback) => {
  const [isOverflow, setIsOverflow] = React.useState(undefined);

  React.useLayoutEffect(() => {
    const { current } = ref;
    const { clientWidth, scrollWidth, clientHeight, scrollHeight } = current;

    const trigger = () => {
      const hasOverflow = isVerticalOverflow
        ? scrollHeight > clientHeight
        : scrollWidth > clientWidth;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref, isVerticalOverflow]);

  return isOverflow;
};

export default useIsOverflow;
