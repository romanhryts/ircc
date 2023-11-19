import styles from './currency-converter.module.css';
import CurrencyConverterForm from './components/currency-converter-form';
import {
  CurrencyConverterProvider,
  useCurrencyConverter,
} from './contexts/currency-converter';
import ShouldRender from '../../shared/components/should-render';
import { msToSeconds } from '../../shared/utils/time';
import { REQUEST_RETRY_INTERVAL } from './utils';
import CurrencyConverterTable from './components/currency-converter-table';

const CurrencyConverter = () => {
  const { error } = useCurrencyConverter();
  return (
    <>
      <ShouldRender if={error}>
        <div className={styles.error}>
          <p>Oops! {error?.message}</p>
          <p>
            Either reload a page or wait {msToSeconds(REQUEST_RETRY_INTERVAL)} seconds until revalidation happens
          </p>
        </div>
      </ShouldRender>
      <ShouldRender if={!error}>
        <div className={styles.converter}>
          <CurrencyConverterTable/>
          <CurrencyConverterForm />
        </div>
      </ShouldRender>
    </>
  );
};

export default () => {
  return (
    <CurrencyConverterProvider>
      <CurrencyConverter />
    </CurrencyConverterProvider>
  );
};
