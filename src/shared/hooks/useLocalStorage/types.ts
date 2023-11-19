export type UseLocalStorageOptions<T = null> = {
  initialValue: T;
};

export type UseLocalStorageSet<T = null> = T | ((prev: T) => T);
