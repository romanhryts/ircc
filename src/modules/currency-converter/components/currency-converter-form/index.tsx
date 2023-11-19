import Icon from '../../../../shared/components/icon';
import styles from './currency-converter-form.module.css';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useCurrencyConverter } from '../../contexts/currency-converter';

const CurrencyConverterForm = () => {
  const {
    currencies,
    currentCurrency,
    targetCurrency,
    targetAmount,
    currentAmount,
    setCurrentCurrency,
    setTargetCurrency,
    setCurrentAmount,
    setTargetAmount,
    swapCurrencies,
  } = useCurrencyConverter();

  return (
        <div className={styles.form}>
          <div className={styles.control}>
            <InputNumber
              placeholder="0.00"
              value={currentAmount}
              onChange={({ value }) => setCurrentAmount(Number(value))}
              minFractionDigits={2}
              maxFractionDigits={5}
            />
            <Dropdown
              options={currencies}
              value={currentCurrency}
              onChange={({ value }) => setCurrentCurrency(value)}
              style={{ width: '110px' }}
            />
          </div>
          <button className={styles.swap} onClick={swapCurrencies}>
            <Icon id="swap_horiz" />
          </button>
          <div className={styles.control}>
            <InputNumber
              placeholder="0.00"
              value={targetAmount}
              onChange={({ value }) => setTargetAmount(Number(value))}
              minFractionDigits={2}
              maxFractionDigits={5}
            />
            <Dropdown
              options={currencies}
              value={targetCurrency}
              onChange={({ value }) => setTargetCurrency(value)}
              style={{ width: '110px' }}
            />
          </div>
        </div>
  );
};

export default CurrencyConverterForm;
