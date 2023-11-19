import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';
import { config } from '../../../../config';
import { isNullish } from '../../../../shared/utils/is-type';
import { useLocalStorage } from '../../../../shared/hooks/useLocalStorage';
import {
  Currency,
  CurrencyRates,
  CurrencyRatesUpdateKeys,
} from '../../../../shared/types/currency';
import { Nullable } from '../../../../shared/types/utility';
import { CurrencyConvertFlag } from '../../types';
import { isCurrentFlag, REQUEST_RETRY_INTERVAL } from '../../utils';

type CurrencyConverterContextState = {
  currentCurrency: Currency;
  targetCurrency: Currency;
  currentAmount: Nullable<number>;
  targetAmount: Nullable<number>;
  currencies: Currency[];
  rates: CurrencyRates[];
  error: Nullable<{ message: string }>; // can be converted to some type i.e. ApiError according to error model which internal API returns
  setCurrentCurrency: (value: Currency) => void;
  setTargetCurrency: (value: Currency) => void;
  setCurrentAmount: (value: number) => void;
  setTargetAmount: (value: number) => void;
  swapCurrencies: () => void;
  updateCurrencyRate: (
    currency: Currency,
    key: CurrencyRatesUpdateKeys,
    value: string,
  ) => void;
};

const initialState: CurrencyConverterContextState = {
  currentCurrency: Currency.CHF,
  targetCurrency: Currency.PLZ,
  currentAmount: null,
  targetAmount: null,
  currencies: [],
  rates: [],
  error: null,
  setCurrentCurrency: (value: Currency) => {},
  setTargetCurrency: (value: Currency) => {},
  setCurrentAmount: (value: number) => {},
  setTargetAmount: (value: number) => {},
  swapCurrencies: () => {},
  updateCurrencyRate: (
    currency: Currency,
    key: CurrencyRatesUpdateKeys,
    value: string,
  ) => {},
};

const CurrencyConverterContext =
  createContext<CurrencyConverterContextState>(initialState);
const REQ_LIMIT_COUNT_KEY = 'requests_limit_count';
const REQ_LIMIT_VALUE = 5;
const REQ_INIT_VALUE = 0;

export const CurrencyConverterProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [requests, setRequests] = useLocalStorage<number>(REQ_LIMIT_COUNT_KEY, {
    initialValue: 0,
  });
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(
    initialState.currentCurrency,
  );
  const [targetCurrency, setTargetCurrency] = useState<Currency>(
    initialState.targetCurrency,
  );
  const [currentAmount, setCurrentAmount] = useState<Nullable<number>>(
    initialState.currentAmount,
  );
  const [targetAmount, setTargetAmount] = useState<Nullable<number>>(
    initialState.targetAmount,
  );
  const key = `${config.apiBaseUrl}/pubinfo?json&exchange&coursid=4`;
  const { data, error, mutate } = useSWR<CurrencyRates[]>(
    key,
    key =>
      new Promise((resolve, reject) => {
        if (requests >= REQ_LIMIT_VALUE) {
          return reject({ message: 'Requests limit exceeded.' });
        }
        return fetch(key)
          .then(response => response.json())
          .then(resolve);
      }),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: REQUEST_RETRY_INTERVAL,
      onSuccess: () => setRequests(p => p + 1),
      onError: () => setRequests(REQ_INIT_VALUE),
    },
  );

  const updateCurrencyRate = (
    currency: Currency,
    key: CurrencyRatesUpdateKeys,
    value: string,
  ): void => {
    if (!data) return;
    const updatedRates = data.map(rate => {
      if (rate.ccy !== currency) return rate;
      return { ...rate, [key as unknown as keyof typeof rate]: value };
    });
    void mutate(updatedRates, { revalidate: false });
  };

  const currencies = [Currency.UAH, ...(data ?? []).map(item => item.ccy)];
  const swapCurrencies = () => {
    const updatedCurrent = targetCurrency;
    const updatedTarget = currentCurrency;

    setCurrentCurrency(updatedCurrent);
    setTargetCurrency(updatedTarget);
  };

  const convert = (flag: CurrencyConvertFlag) => {
    if ([currentCurrency, targetCurrency, data].some(isNullish)) {
      return;
    }

    if ([currentAmount, targetAmount].every(isNullish)) {
      return;
    }

    if (currentCurrency === targetCurrency) {
      const syncValue = isCurrentFlag(flag) ? currentAmount : targetAmount;
      setCurrentAmount(syncValue);
      setTargetAmount(syncValue);
      return;
    }

    const setter = isCurrentFlag(flag) ? setTargetAmount : setCurrentAmount;
    const amount = isCurrentFlag(flag) ? currentAmount : targetAmount;
    const cCurrency = isCurrentFlag(flag) ? currentCurrency : targetCurrency;
    const tCurrency = isCurrentFlag(flag) ? targetCurrency : currentCurrency;

    const currentRate = data!.find(rate => rate.ccy === cCurrency)?.buy ?? '1';
    const targetRate = data!.find(rate => rate.ccy === tCurrency)?.buy ?? '1';
    const diff = parseFloat(currentRate) / parseFloat(targetRate);
    setter(Number(amount) * diff);
  };

  useEffect(() => {
    convert(CurrencyConvertFlag.CURRENT);
  }, [currentAmount, currentCurrency, targetCurrency]);

  useEffect(() => {
    convert(CurrencyConvertFlag.TARGET);
  }, [targetAmount]);

  const value = {
    currentCurrency,
    targetCurrency,
    currentAmount,
    targetAmount,
    rates: data ?? [],
    currencies,
    setCurrentAmount,
    setTargetAmount,
    setCurrentCurrency,
    setTargetCurrency,
    swapCurrencies,
    updateCurrencyRate,
    error,
  };

  return (
    <CurrencyConverterContext.Provider value={value}>
      {children}
    </CurrencyConverterContext.Provider>
  );
};

export const useCurrencyConverter = () => useContext(CurrencyConverterContext);
