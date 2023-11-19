import { useCallback, useState } from 'react';
import { Nullable } from '../../types/utility';
import { isFunction } from '../../utils/is-type';
import { toJSONString } from '../../utils/serializers';
import { UseLocalStorageOptions, UseLocalStorageSet } from './types';
import { DEFAULT_OPTIONS } from './config';

export function useLocalStorage<T>(
  key: string,
  options: Partial<UseLocalStorageOptions<Nullable<T>>> = DEFAULT_OPTIONS,
) {
  const [value, setValue] = useState<T>(() => {
    if (options.initialValue) {
      localStorage.setItem(key, toJSONString(options.initialValue))
      return options.initialValue;
    }
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  });

  const set = useCallback((setter: UseLocalStorageSet<T>) => {
    setValue((prev) => {
      const next = isFunction(setter) ? setter(prev) : setter;
      localStorage.setItem(key, toJSONString(next));
      return next;
    })
  }, [key, value]);

  const clear = useCallback(() => {
    localStorage.removeItem(key);
    setValue(null as T);
  }, [key]);

  return [value, set, clear] as const;
}
