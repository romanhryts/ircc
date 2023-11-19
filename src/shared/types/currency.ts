export enum Currency {
  UAH = 'UAH',
  CHF = 'CHF',
  CZK = 'CZK',
  GBP = 'GBP',
  ILS = 'ILS',
  JPY = 'JPY',
  NOK = 'NOK',
  PLZ = 'PLZ',
  SEK = 'SEK',
}

export type CurrencyRates = {
  base_ccy: Currency.UAH;
  ccy: Currency;
  sale: string;
  buy: string;
};

export type CurrencyRatesUpdateKeys = Pick<CurrencyRates, 'buy' | 'sale'>;
