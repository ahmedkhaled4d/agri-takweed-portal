import React from 'react';
import styles from './reportsTables.module.css';

function ReportsButton({ text, onClick, selectedReport }) {
  // console.log(selectedReport.name);
  return (
    <button
      onClick={onClick}
      className={`${
        text === selectedReport.name ? styles.ReportsTableButtonsSelected : ''
      }`}
    >
      {text}
    </button>
  );
}

export default ReportsButton;
