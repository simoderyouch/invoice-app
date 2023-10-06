import React from "react";

function useToggle(initialState) {
  const [toggle, set] = React.useState(initialState);

  const handlers = React.useMemo(
    () => ({
      on: () => {
        set(true);
      },
      off: () => {
        set(false);
      },
      toggle: () => {
        set((prev) => !prev);
      },
    }),
    [toggle, set]
  );
  return [toggle, handlers];
}

export { useToggle };