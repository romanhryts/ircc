export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isNullish = (value: unknown): value is undefined | null => {
  return isNull(value) || isUndefined(value);
};

export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
}
