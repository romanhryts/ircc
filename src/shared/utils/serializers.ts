import { isString } from './is-type';

export const toJSONString = (value: unknown): string => {
  return isString(value) ? value : JSON.stringify(value);
}
