import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import axios from 'services/axios.inercept';
import './toggleButton.css';

function ToggleWhatsAppBtn({
  active,
  showingNow,
  setShowingNow,
  request,
  resetButtons,
  whatsFormshowingNow,
  setWhatsFormShowingNow,
  sent,
}) {
  //   console.log(activeRef);
  const [activation, setActivation] = useState(active);
  const [loading, setLoading] = useState(false);

  //https://stackoverflow.com/questions/61683928/why-does-parent-onclick-trigger-before-child-onchange
  function handleClick(e) {
    e.stopPropagation();
  }

  // useEffect(() => {
  //   setActivation(true);
  // }, [resetButtons]);

  useEffect(() => {
    setActivation(false);
  }, [sent]);

  function handleActivation(active, request) {
    setLoading(true);
    if (active === true) {
      setWhatsFormShowingNow((prev) => {
        const filteredData = prev.filter((el) => {
          // console.log(el);
          return el._id !== request._id;
        });
        // console.log('filteredData', filteredData);
        setActivation(false);
        setLoading(false);
        return filteredData;
      });
    } else {
      setWhatsFormShowingNow((prev) => {
        const addedBefore = prev.findIndex((el) => {
          return el._id === request._id;
        });
        setActivation(true);
        setLoading(false);
        if (addedBefore !== -1) {
          return prev;
        } else {
          return [...prev, request];
        }
      });
    }
  }

  return (
    <label className="switch text-center" onClick={handleClick}>
      <input
        name="activation"
        type="checkbox"
        onChange={(e) => {
          handleActivation(activation, request);
        }}
        checked={activation}
      />
      <div className="slider round">
        <span className="on">
          {loading ? (
            <Spinner
              animation="border"
              role="status"
              className="h5 "
              style={{ width: '1.4rem', height: '1.4rem' }}
            ></Spinner>
          ) : (
            'مفعل'
          )}
        </span>
        <span className="off">
          {loading ? (
            <Spinner
              animation="border"
              role="status"
              className="h5 "
              style={{ width: '1.4rem', height: '1.4rem' }}
            ></Spinner>
          ) : (
            'غير مفعل'
          )}
        </span>
      </div>
    </label>
  );
}

export default ToggleWhatsAppBtn;
