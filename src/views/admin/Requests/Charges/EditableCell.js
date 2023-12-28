import React, { useState } from 'react';

function EditableCell({
  value: initialValue,
  row,
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  stepNum,
  errorExists,
  setErrorExists,
}) {
  // We need to keep and update the state of the cell normally
  const [newValue, setNewValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setNewValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const handleInputBtn = () => {
    // console.log(newValue);
    if (isNaN(newValue)) {
      setError('يجب إدخال رقم صحيح');
      setErrorExists(true);
      return;
    }
    if (Number(newValue) === 0 || Number(newValue) < 0) {
      setError('يجب إدخال رقم اكبر من صفر');
      setErrorExists(true);
      return;
    }
    // console.log(typeof row.values.currentAmount);
    if (stepNum !== '1') {
      const valuetoCompare = row.values.currentAmount || row.values.amount;
      // console.log(valuetoCompare);
      if (Number(newValue) > Number(valuetoCompare)) {
        // console.log(initialValue);
        // console.log(row.values.currentAmount);
        setError('يجب إدخال رقم اقل او يساوي المتاح');
        setErrorExists(true);
        return;
      }
    }

    setError(null);
    setErrorExists(false);
    updateMyData(row.index, id, newValue);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setNewValue(initialValue);
  }, [initialValue]);

  return (
    <>
      {stepNum === '1' ? <span className="ml-1">+</span> : ''}
      <input
        value={newValue}
        onChange={onChange}
        onBlur={handleInputBtn}
        type="number"
      />
      {/* <button
        style={{
          padding: 'red',
          backgroundColor: 'green',
          borderColor: 'rgba(153, 153, 153, 0.2)',
        }}
        onClick={handleInputBtn}
      >
        إدخال
      </button> */}
      {error && (
        <span
          style={{ display: 'block', color: 'red', marginBlockStart: '0.5em' }}
        >
          {error}
        </span>
      )}
    </>
  );
}

export default EditableCell;
