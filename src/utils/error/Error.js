import React from 'react';
import './error.css';

function Error(props) {
  return <div className="error">{props.children}</div>;
}

export default Error;
