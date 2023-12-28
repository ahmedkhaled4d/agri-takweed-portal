import React, { useEffect, useRef, useState } from 'react';
import styles from './checkListComponent.module.css';
import CheckBox from './checkBox/index';

const CheckListComponent = ({
  itemsArr,
  setSelectedItems,
  buttonLabel,
  // globalListIsOpen,
}) => {
  const [boxesState, setBoxesState] = useState([]);
  const [listIsOpen, setListIsOpen] = useState(false);
  const listRef = useRef(null);

  const handleSelectAll = () => {
    // if (boxesState.length === 0) {
    //   setBoxesState(new Array(itemsArr.length).fill(false));
    // }
    setBoxesState(function (prev) {
      return prev.map((el) => {
        return (el = true);
      });
    });
  };

  const handleRemoveAll = () => {
    setBoxesState(function (prev) {
      return prev.map((el) => {
        return (el = false);
      });
    });
  };

  useEffect(() => {
    if (boxesState.length === 0) {
      setBoxesState(new Array(itemsArr.length).fill(false));
    }
  }, [itemsArr, boxesState]);

  useEffect(() => {
    // function closeDropDown(e) {
    //   console.log(e.path[0].classList.value.includes('boxes_container'));
    //   console.log(e.target.closest('button'));
    //   if (!e.path[0].classList.value.includes('boxes_container')) {
    //     setListIsOpen(false);
    //   } else {
    //     setListIsOpen(true);
    //   }
    // }

    function handleClickOutside(event) {
      // console.log(listRef.current.contains(event.target));
      // console.log(event.target);

      //hmsk el element ele shayl el zorar wl list ele 3nde fe ref w 2shoof lw dost 3ala 2y 7aga tnya 8ero 2ro7 2a2fel b false.
      if (listRef.current && !listRef.current.contains(event.target)) {
        setListIsOpen(false);
      }
    }

    document.body.addEventListener('click', handleClickOutside);

    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className={styles.list_container} ref={listRef}>
        <button
          type="button"
          className={styles.list_drop_btn}
          onClick={() => setListIsOpen((prev) => !prev)}
        >
          {buttonLabel}
          <span> ▾ </span>
        </button>

        {listIsOpen && (
          <div className={styles.boxes_container}>
            <div className={styles.list_btns}>
              <button
                onClick={handleSelectAll}
                className={styles.list_btn}
                type="button"
              >
                اختر الكل
              </button>
              <button
                onClick={handleRemoveAll}
                className={styles.list_btn}
                type="button"
              >
                ازالة الكل
              </button>
            </div>
            {itemsArr.map((el, i) => {
              return (
                <div className={styles.list_boxes} key={i}>
                  <CheckBox
                    item={el}
                    index={i}
                    itemsArr={itemsArr}
                    setBoxesState={setBoxesState}
                    setSelectedItems={setSelectedItems}
                    boxesState={boxesState}
                  />
                </div>
              );
            })}

            {/* <button
              className={styles.list_btn}
              onClick={(e) => console.log(selectedItems)}
              disabled={selectedItems <= 0}
              type="button"
            >
              بحث
            </button> */}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckListComponent;
