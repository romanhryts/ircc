import { useCurrencyConverter } from '../../contexts/currency-converter';
import EditableField from '../../../../shared/components/editable-field';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CSSProperties } from 'react';
import { CurrencyRatesUpdateKeys } from '../../../../shared/types/currency';

const cellStyles: Partial<CSSProperties> = {
  paddingBottom: 0,
  paddingTop: 0,
  width: '33vw',
};

const CurrencyConverterTable = () => {
  const { rates, updateCurrencyRate } = useCurrencyConverter();

  // can be converted to reusable function, i.e. isNumberDiffWithinPercentage(prevValue: number, value: number, percentage: number)
  const isWithin10Percent = (prevValue: number, value: number): boolean => {
    const threshold = prevValue * 0.1;
    return value >= prevValue - threshold && value <= prevValue + threshold;
  };

  return (
    <DataTable value={rates}>
      <Column field="ccy" header="Currency" />
      <Column
        bodyStyle={cellStyles}
        field="buy"
        header="Buy"
        body={({ buy, ccy }) => (
          <EditableField
            value={parseFloat(buy)}
            onValueChange={v =>
              updateCurrencyRate(
                ccy,
                'buy' as unknown as CurrencyRatesUpdateKeys,
                String(v),
              )
            }
            onBeforeSubmitValidator={prevValue =>
              isWithin10Percent(parseFloat(prevValue), parseFloat(buy))
            }
          />
        )}
      />
      <Column
        bodyStyle={cellStyles}
        field="sale"
        header="Sell"
        body={({ sale, ccy }) => {
          return (
            <EditableField
              value={parseFloat(sale)}
              onValueChange={v =>
                updateCurrencyRate(
                  ccy,
                  'sale' as unknown as CurrencyRatesUpdateKeys,
                  String(v),
                )
              }
              onBeforeSubmitValidator={prevValue =>
                isWithin10Percent(parseFloat(prevValue), parseFloat(sale))
              }
            />
          );
        }}
      />
    </DataTable>
  );
};

export default CurrencyConverterTable;
