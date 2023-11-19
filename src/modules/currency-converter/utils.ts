import { CurrencyConvertFlag } from './types';

export const isCurrentFlag = (
  flag: CurrencyConvertFlag,
): flag is CurrencyConvertFlag.CURRENT => {
  return flag === CurrencyConvertFlag.CURRENT;
};

export const REQUEST_RETRY_INTERVAL = 5000;
