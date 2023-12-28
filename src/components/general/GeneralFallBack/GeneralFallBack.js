import React from 'react';
import { Spinner } from 'reactstrap';
import styles from './generalFallBack.module.css';

function GeneralFallBack() {
  return (
    <div className={styles.fallbackSpinner}>
      <Spinner
        animation="border"
        role="status"
        style={{ padding: '3.5em' }}
      ></Spinner>
    </div>
  );
}

export default GeneralFallBack;
