import React from 'react';
import styles from './checkListComponent/checkListComponent.module.css';

function ErrorFormikComponent(props) {
  return <div className={styles.errors}>{props.children}</div>;
}

export default ErrorFormikComponent;
