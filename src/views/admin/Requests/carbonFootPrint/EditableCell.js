import React, { useState } from 'react';
import styles from '../requests.module.css';

export const options = [
  { lable: 'A+', value: 'A+' },
  { lable: 'A', value: 'A' },
  { lable: 'B', value: 'B' },
  { lable: 'C', value: 'C' },
  { lable: 'D', value: 'D' },
  { lable: 'E', value: 'E' },
  { lable: 'F', value: 'F' },
  { lable: 'G', value: 'G' },
];
function EditableCell({
  value: initialValue,
  row,
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) {
  // We need to keep and update the state of the cell normally
  const [newValue, setNewValue] = useState(initialValue);

  const onChange = (e) => {
    setNewValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const handleInputBtn = () => {
    updateMyData(row.index, id, newValue);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setNewValue(initialValue);
  }, [initialValue]);

  return (
    <>
      <select
        className={styles.footprintInputBorder}
        value={newValue}
        onChange={onChange}
        onBlur={handleInputBtn}
      >
        <option key={700} value="">
          .. اختر البصمة الكربونية
        </option>
        {options.map((el, index) => (
          <option key={index} value={el.value}>
            {el.lable}
          </option>
        ))}
      </select>
    </>
  );
}

export default EditableCell;
