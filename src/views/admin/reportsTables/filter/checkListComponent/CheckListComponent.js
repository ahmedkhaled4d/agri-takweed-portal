import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './checkListComponent.module.css';
import { Field, useField } from 'formik';
import { FormGroup, Input } from 'reactstrap';

const CheckListComponent = ({
  name,
  data,
  placeholder,
  selectAll,
  setFieldValue,
  toggleFieldName,
  formRef,
}) => {
  // console.log('CheckListComponent', name, data, placeholder);
  const [field, meta] = useField({ name: name });
  const [listData, setListData] = useState(data);
  const [listIsOpen, setListIsOpen] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      setListData(data);
    }
  }, [data]);

  const debounceSearch = useCallback(debounce(search), []);

  function debounce(func, timeout = 400) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
  
  function search(str, data) {
    if (str === '') {
      setListData(data);
    } else {
      let filtredData = data.filter((ele) => {
        return ele.label.includes(str) && ele;
      });
      setListData(filtredData);
    }
    setListIsOpen(true);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!listRef?.current?.contains(event.target)) {
        setListIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [listRef]);

  return (
    <>
      <div ref={listRef} style={{ position: 'relative' }}>
        <FormGroup className={styles.searchBoxContainer}>
          <i className="fas fa-search"></i>
          <Input
            type="text"
            onChange={(e) => {
              debounceSearch(e.target.value, data);
            }}
            placeholder={placeholder}
          />
          <i
            onClick={(e) => {
              setListIsOpen((prev) => !prev);
            }}
            style={{ cursor: 'pointer' }}
            className="fas fa-chevron-down"
          ></i>

          {/* {form.errors.totalData &&
                form.errors.totalData[index] &&
                form.errors.totalData[index].crop && (
                  // touched.totalData &&
                  // touched.totalData[index] &&
                  // touched.totalData[index].crop &&
                  <span className="text-danger">
                    {form.errors.totalData[index].crop}
                  </span>
                )} */}
        </FormGroup>

        {listIsOpen && (
          <div className={`shadow ` + styles.checkboxListContainer}>
            <label className={styles.checkboxListItem}>
              <Field
                onChange={() => {
                  if (
                    !selectAll &&
                    formRef.current.values[name].length !== data.length
                  ) {
                    setFieldValue(toggleFieldName, true);
                    setFieldValue(
                      field.name,
                      data.map((checkbox) => checkbox.value)
                    );
                  } else {
                    setFieldValue(toggleFieldName, false);
                    setFieldValue(field.name, []);
                  }
                }}
                checked={selectAll}
                type="checkbox"
                name={field.name}
                id={field.name}
                className={styles.selectallInput}
              />
              اختر الكل
            </label>
            {listData.map((item, i) => {
              return (
                <div key={i}>
                  <label className={styles.checkboxListItem}>
                    <Field
                      type="checkbox"
                      name={field.name}
                      id={field.name}
                      value={item.value}
                    />
                    {item.label}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckListComponent;
