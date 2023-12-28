import React from 'react';
import styles from '../charges.module.css';

function HubButton({ text, onClick, selectedHub }) {
  // console.log(selectedReport.name);
  return (
    <button
      onClick={onClick}
      className={`${
        text === selectedHub?.name ? styles.ReportsTableButtonsSelected : ''
      }`}
    >
      {text}
    </button>
  );
}

export default HubButton;
