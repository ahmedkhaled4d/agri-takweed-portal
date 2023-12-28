import { ReactSearchAutocomplete } from "react-search-autocomplete";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "services/axios.inercept";
import styles from "./form.module.css";

export default function SelectEngineers({ setFieldValue, fieldName }) {
  const [engineers, setEngineers] = useState([]);
  function getEngineers() {
    axios
      .get("admin/user/engineers")
      .then((data) => {
        let modifiedArr = data.data.data.map((ele) => {
          return { ...ele, phone: ele.phone.substring(2, 13), id: ele._id };
        });
        setEngineers(modifiedArr);
      })
      .catch((e) => console.log("error", e));
  }
  useEffect(() => {
    getEngineers();
  }, []);

  const handleOnSelect = (item) => {
    setFieldValue(fieldName, item._id);
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "right" }}>
          {item.name}
        </span>
        <span style={{ display: "block", textAlign: "right" }}>
          {item.phone}
        </span>
      </>
    );
  };
  return (
    <>
      <div
        className={`${styles.selectContainer} ReactSearchAutocomplete-48651532`}
      >
        <ReactSearchAutocomplete
          items={engineers}
          onSelect={handleOnSelect}
          autoFocus
          formatResult={formatResult}
          // maxResults={12}
          styling={{
            border: "1px green solid ",
            borderRadius: "4px",
          }}
          fuseOptions={{
            keys: ["name", "phone"],
            threshold: 0.1,
          }}
          name={fieldName}
        />
      </div>
    </>
  );
}
