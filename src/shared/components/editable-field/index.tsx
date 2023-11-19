import { FC, useState, KeyboardEvent } from 'react';
import ShouldRender from '../should-render';
import styles from './editable-field.module.css';
import Icon from '../icon';
import { InputNumber } from 'primereact/inputnumber';

type Props = {
  value: number;
  onValueChange: (value: string) => void;
  onBeforeSubmitValidator?: (value: string) => boolean;
};

const EditableField: FC<Props> = ({
  value,
  onValueChange,
  onBeforeSubmitValidator,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<number>(value);

  const onKeyUp = (evt: KeyboardEvent<HTMLInputElement>) => {
    // better to store such values in some enum or map
    const isSubmitAction = evt.code === 'Enter';
    if (!isSubmitAction) {
      return;
    }

    const value = (evt.target as HTMLInputElement).value;
    if (!onBeforeSubmitValidator) {
      onValueChange(value);
      setEditing(false);
      return;
    }

    // also it would be nice to improve this part, i.e. this function could return some object { error: '...' } or null if valid
    const isValid = onBeforeSubmitValidator(value);
    if (!isValid) {
      return;
    }

    onValueChange(value);
    setEditing(false);
  };

  return (
    <>
      <ShouldRender if={!editing}>
        <div className={styles.inactive} onClick={() => setEditing(true)}>
          <span>{value}</span>
          <Icon id="edit" classes={styles.icon} />
        </div>
      </ShouldRender>
      <ShouldRender if={editing}>
        <InputNumber
          maxFractionDigits={5}
          value={localValue}
          onChange={(evt) => setLocalValue(evt.value ?? 0)}
          onKeyUp={onKeyUp}
          autoFocus
        />
      </ShouldRender>
    </>
  );
};

export default EditableField;
