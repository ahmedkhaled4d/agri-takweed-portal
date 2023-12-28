import React, { useRef, useEffect } from 'react';
import styles from './checkListComponent.module.css';
import { Field } from 'formik';

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
  centerLoading,
  handleGovChange,
  handleChange,
}) => {
  const ref = useRef();
  const govListIds = useRef([]);
  // console.log(dataArray);
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
            <label className={styles.selectallLabel}>
              <Field
                onChange={(e) => {
                  if (
                    !selectAll &&
                    outSideValues.current.values[fieldName].length !==
                      dataArray?.length
                  ) {
                    setFieldValue(fieldValue, true);
                    setFieldValue(
                      fieldName,
                      dataArray?.map((checkbox) => checkbox.value)
                    );
                    if (fieldName === 'checkedGovernorate') {
                      handleGovChange(
                        dataArray?.map((checkbox) => checkbox.value)
                      );
                      // console.log(
                      //   'fieldName',
                      //   dataArray?.map((checkbox) => checkbox.value)
                      // );
                    }
                  } else {
                    setFieldValue(fieldValue, false);
                    setFieldValue(fieldName, []);
                  }
                }}
                checked={selectAll}
                type="checkbox"
                name={fieldValue}
                id={fieldValue}
                className={styles.selectallInput}
              />
              اختر الكل
            </label>

            {centerLoading ? (
              <div className="spinner-border text-success" role="status"></div>
            ) : (
              dataArray?.map((item, i) => {
                return (
                  <div className={styles.list_boxes} key={i}>
                    <label>
                      <Field
                        type="checkbox"
                        name={fieldName}
                        id={fieldName}
                        value={item.value}
                        onChange={(e) => {
                          handleChange(e);
                          if (fieldName === 'checkedGovernorate') {
                            // console.log(e.target);
                            if (e.target.checked) {
                              govListIds.current.push(e.target.value);
                            } else {
                              govListIds.current = govListIds.current.filter(
                                (ele) => {
                                  return ele !== e.target.value;
                                }
                              );
                            }

                            handleGovChange(govListIds.current);
                          }
                        }}
                      />
                      {item.label}
                    </label>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckListComponent;
