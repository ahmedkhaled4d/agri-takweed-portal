import React from 'react';
import styles from './error.module.css';

function Error({ errors }) {
  // console.log(errors);
  return (
    <>
      {errors &&
        Object.values(errors).map((el, i) => {
          return (
            <p key={i} style={{ color: 'red' }}>
              <span>-</span> {el}
            </p>
          );
        })}
    </>
  );
}

export default Error;
