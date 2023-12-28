import React, { useRef, useEffect } from 'react';
import styles from './checkListComponent.module.css';
import mapStyles from '../../map.module.css';

import { Field } from 'formik';
import { Button, Spinner } from 'reactstrap';

const CheckListComponent = ({
  setFieldValue,
  dataArray,
  listIsOpen,
  setListIsOpen,
  listTitle,
  selectAll,
  fieldName,

  values,
  outSideValues,
  setTouched,
  isSubmitting,
}) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref?.current?.contains(event.target)) {
        setListIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);
  return (
    <>
      <div
        role="group"
        aria-labelledby="checkbox-group"
        className={styles.list_container}
        ref={ref}
        onBlur={(event) => {
          if (
            !outSideValues.current.values[fieldName].length > 0 &&
            ref?.current?.contains(event.target)
          ) {
            // console.log(outSideValues.current);
            setTouched({
              ...outSideValues.current.touched,
              [fieldName]: true,
            });
          }
        }}
      >
        <button
          // className={styles.list_drop_btn}
          className={[mapStyles.btn, mapStyles.btn_edit].join(' ')}
          onClick={(e) => {
            setListIsOpen((prev) => !prev);
            e.preventDefault();
          }}
        >
          {listTitle}
          <span> ▾ </span>
        </button>
        {listIsOpen && (
          <div className={styles.boxes_container}>
            {/* <label className={styles.selectallLabel}> */}
            <button
              type="submit"
              disabled={isSubmitting}
              id={styles.combinedMapSearchBtn}
              className={styles.deleteFormBtn}
            >
              {/* <Spinner className={styles.searchBtnSpinner}></Spinner> */}
              {isSubmitting ? (
                <Spinner className={styles.searchBtnSpinner}></Spinner>
              ) : (
                'بحث'
              )}
            </button>

            <div className={styles.list_boxes}>
              <select name={fieldName} id={fieldName}>
                <option value="" label="Select a color">
                  Select a color
                </option>
                {dataArray.map((item, i) => {
                  return (
                    <option value={item.value} label={item.label} key={i}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* {dataArray.map((item, i) => {
              return (
                <div className={styles.list_boxes} key={i}>
                  <label style={{ color: 'white' }}>
                    <Field
                      type="checkbox"
                      name={fieldName}
                      id={fieldName}
                      value={item.value}
                    />
                    {item.label}
                  </label>
                </div>
              );
            })} */}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckListComponent;
