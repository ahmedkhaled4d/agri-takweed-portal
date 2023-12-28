import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import axios from 'services/axios.inercept';
import './toggleButton.css';

function ToggleButton({ active, id }) {
  //   console.log(activeRef);
  const [activation, setActivation] = useState(active);
  const [loading, setLoading] = useState(false);

  //https://stackoverflow.com/questions/61683928/why-does-parent-onclick-trigger-before-child-onchange
  function handleClick(e) {
    e.stopPropagation();
  }

  function handleActivation(active, id) {
    setLoading(true);
    if (active === true) {
      axios
        .put('/admin/location/deactive/' + id)
        .then((response) => {
          toast.success(`تم الايقاف بنجاح`);
          // console.log(response);
          setActivation(false);
          setLoading(false);
        })
        .catch((e) => {
          toast.error('خطا ...');
          setLoading(false);
        });
    } else {
      // console.log('will active');
      axios
        .put('/admin/location/active/' + id)
        .then((response) => {
          toast.success(`تم التفعيل بنجاح`);
          // console.log(response);
          setActivation(true);
          setLoading(false);
        })
        .catch((e) => {
          toast.error('خطا ...');
          setLoading(false);
        });
    }
  }

  return (
    <label className="switch text-center" onClick={handleClick}>
      <input
        name="activation"
        type="checkbox"
        onChange={(e) => {
          handleActivation(activation, id);
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

export default ToggleButton;
