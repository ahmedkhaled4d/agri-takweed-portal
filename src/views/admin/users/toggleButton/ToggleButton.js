import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import axios from 'services/axios.inercept';
import './toggleButton.css';

function ToggleButton({
  active,
  permissionKey='',
  id='',
  type = "user",
  // setUpdateFlag,
   reload,
  permissionArr=[]
  
}) {
  //   console.log(activeRef);
  const [activation, setActivation] = useState(active);
  const [loading, setLoading] = useState(false);

  //https://stackoverflow.com/questions/61683928/why-does-parent-onclick-trigger-before-child-onchange
  function handleClick(e) {
    e.stopPropagation();
  }

  function handleUserActivation(active, id) {
    const endpoint = `/admin/user/${id}/deactive`
    setLoading(true);
    if (active === true) {
      axios
        .put(endpoint)
        .then((response) => {
          toast.success(`تم الايقاف بنجاح`);
          // console.log(response);
          setActivation(false);
          setLoading(false);
          // setUpdateFlag(true);
          reload()
        })
        .catch((e) => {
          toast.error("خطا ...");
          setLoading(false);
        });
    }
    else {
      const endpoint = `/admin/user/${id}/active`
      axios
        .put(endpoint)
        .then((response) => {
          toast.success(`تم التفعيل بنجاح`);
          setActivation(true);
          setLoading(false);
          reload()
        })
        .catch((e) => {
          toast.error("خطا ...");
          setLoading(false);
        });
    }
  }
  // function handleActivation(active, id) {
  //   console.log(type);
  //   const endpoint =
  //     type === "user"
  //       ? `/admin/user/${id}/deactive`
  //       : `/admin/user/${id}/deactivecert`;
  //   setLoading(true);
  //   if (active === true) {
  //     axios
  //       .put(endpoint)
  //       .then((response) => {
  //         toast.success(`تم الايقاف بنجاح`);
  //         // console.log(response);
  //         setActivation(false);
  //         setLoading(false);
  //         setUpdateFlag(true);
  //       })
  //       .catch((e) => {
  //         toast.error("خطا ...");
  //         setLoading(false);
  //         setUpdateFlag(false);
  //       });
  //   } else {
  //     // console.log('will active');
  //     const endpoint =
  //       type === "user"
  //         ? `/admin/user/${id}/active`
  //         : `/admin/user/${id}/activecert`;
  //     axios
  //       .put(endpoint)
  //       .then((response) => {
  //         toast.success(`تم التفعيل بنجاح`);
  //         // console.log(response);
  //         setActivation(true);
  //         setLoading(false);
  //         setUpdateFlag(true);
  //       })
  //       .catch((e) => {
  //         toast.error("خطا ...");
  //         setLoading(false);
  //         setUpdateFlag(false);
  //       });
  //   }
  // }

  function handlePermissionActivation(active) {
    const isFound = permissionArr.current.find(
      (ele) => ele.key===permissionKey
      
    );
    
    if (isFound) {
      isFound.value = !isFound.value;
    }
    else {
        permissionArr.current.push({
            key: permissionKey,
            value: !active,
          });
    }
    if (active === true) {
      setActivation(false); 
    }
    else {
      setActivation(true);
     }
  }

  return (
    <label className="switch text-center" onClick={handleClick}>
      <input
        name="activation"
        type="checkbox"
        onChange={(e) => {
          type==='user'? handleUserActivation(activation,id): handlePermissionActivation(activation);
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
              style={{ width: "1.4rem", height: "1.4rem" }}
            ></Spinner>
          ) : (
            "مفعل"
          )}
        </span>
        <span className="off">
          {loading ? (
            <Spinner
              animation="border"
              role="status"
              className="h5 "
              style={{ width: "1.4rem", height: "1.4rem" }}
            ></Spinner>
          ) : (
            "غير مفعل"
          )}
        </span>
      </div>
    </label>
  );
}

export default ToggleButton;
