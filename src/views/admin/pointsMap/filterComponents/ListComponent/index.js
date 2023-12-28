import React, { useRef, useEffect } from 'react';
import styles from './checkListComponent.module.css';
import { Field } from 'formik';
import axiosApiInstance from 'services/axios.inercept';

const CheckListComponent = ({
  setFieldValue,
  dataArray,
  listIsOpen,
  setListIsOpen,
  listTitle,
  selectAll,
  fieldName,
  fieldValue,
  values,
  outSideValues,
  setTouched,
  handleChange,
  handleGovChange,
}) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      //memic onblur
      // if (
      //   !outSideValues.current.values[fieldName].length > 0 &&
      //   ref?.current?.contains(event.target)
      // ) {
      //   console.log(outSideValues.current);
      //   setTouched({
      //     ...outSideValues.current.touched,
      //     [fieldName]: true,
      //   });
      // }
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
            !outSideValues.current.values[fieldValue] &&
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
          className={styles.list_drop_btn}
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
            {/* <Field
              type="select"
              name={fieldName}
              id={fieldName}
              // value={item.value}
            > */}
            {dataArray.map((item, i) => {
              return (
                <div className={styles.list_boxes} key={i}>
                  <label>
                    <Field
                      type="radio"
                      name={fieldName}
                      id={fieldName}
                      value={item.value}
                      onChange={(e) => {
                        handleChange(e);
                        handleGovChange(e);
                      }}
                    />
                    {item.label}
                  </label>
                </div>
              );
            })}
            {/* </Field> */}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckListComponent;
