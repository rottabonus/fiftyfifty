import React from "react";

type Props<A, B> = {
  key: string | undefined;
  defaultValue: B;
  valueGetter: (data: A) => B;
  data: Record<string, A>;
  dependencies: Array<unknown>;
};

export const useStoreDataLocally = <A, B>({
  key,
  defaultValue,
  valueGetter,
  dependencies,
  data,
}: Props<A, B>) => {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (!key) return;

    const value = data[key];
    if (value) {
      setValue(valueGetter(value));
    }
  }, dependencies);

  return { value, setValue };
};
