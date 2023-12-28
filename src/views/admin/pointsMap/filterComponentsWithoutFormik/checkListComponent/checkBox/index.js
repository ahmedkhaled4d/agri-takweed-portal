import React, { useEffect } from 'react';
import styles from './checkBoxes.module.css';

const CheckBox = ({
  item,
  index,
  itemsArr,
  setSelectedItems,
  boxesState,
  setBoxesState,
}) => {
  useEffect(() => {
    const selectedItemsArr = boxesState.map((boxVal, boxValIndex) => {
      return boxVal === true ? itemsArr[boxValIndex].value : null;
    });

    const finalItemsSelection = selectedItemsArr.filter(
      (cropVal) => cropVal !== null
    );
    setSelectedItems(finalItemsSelection);
  }, [boxesState]);

  const handleOnChange = () => {
    // console.log(boxesState);
    const updatedBoxState = boxesState.map((boxVal, i) => {
      // console.log(boxVal);
      return i === index ? !boxVal : boxVal;
    });

    setBoxesState(updatedBoxState);
  };

  // console.log(boxesState[index]);

  return (
    <label htmlFor={item.label} key={index} className={styles.checkbox_label}>
      <input
        className={styles.checkbox_input}
        type="checkbox"
        id={item.value}
        name={item.label}
        value={item.value}
        checked={boxesState[index]}
        onChange={handleOnChange}
      />
      {item.label}
    </label>
  );
};

export default CheckBox;
