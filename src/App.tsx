import Layout from './shared/components/layout';
import CurrencyConverter from './modules/currency-converter';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { PrimeReactProvider } from 'primereact/api';

const App = () => {
  return (
    <PrimeReactProvider>
      <Layout>
        <CurrencyConverter />
      </Layout>
    </PrimeReactProvider>
  );
};

export default App;

// CurrencyConverter
// -> CurrencyConverterTable
// -> CurrencyConverterControls

// TODO:
//  1. Select
//  2. Input
