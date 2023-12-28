import React from "react";
import { Button, Form, Input } from "reactstrap";
import MapControl from "../MapControl";
import styles from "./searchPointsStyle.module.css";
import { Formik } from "formik";

function SearchPoints({ searchedPoints, setSearchedPoints, renderPolygons }) {
  const handleSubmitForm = (values, { resetForm }) => {
    const copy = [...searchedPoints];
    copy.push({ lat: Number(values.lat), lng: Number(values.lng) });
    setSearchedPoints(copy);
    resetForm();
  };

  return (
    <div>
      <Formik
        initialValues={{
          lat: "",
          lng: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.lat) {
            errors.lat = "* مطلوب";
          }
          if (!values.lng) {
            errors.lng = "* مطلوب";
          }
          if (values.lat && isNaN(parseFloat(values.lat))) {
            errors.lat = "not an number";
          }
          if (values.lng && isNaN(parseFloat(values.lng))) {
            errors.lng = "not an number";
          }
          return errors;
        }}
        onSubmit={handleSubmitForm}>
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          setTouched,
          setFieldValue,
          errors,
        }) => (
          <>
            <MapControl
              position="TOP_LEFT"
              // classNameChild={styles.coorinatesInputContainer}
            >
              <Form
                onSubmit={handleSubmit}
                className={styles.coorinatesInputContainer}>
                <Input
                  onChange={handleChange}
                  placeholder="lng"
                  name="lng"
                  value={values.lng}
                  className={`
                   ${styles.coorinatesInput}  ${
                    errors.lng ? styles.coorinatesInputError : ""
                  }
                  `}
                />
                <span style={{ fontWeight: "900", margin: "0 3px" }}>,</span>
                <Input
                  onChange={handleChange}
                  placeholder="lat"
                  name="lat"
                  value={values.lat}
                  className={`
                   ${styles.coorinatesInput}  ${
                    errors.lat ? styles.coorinatesInputError : ""
                  }
                  `}
                />

                {/* backend filter button */}
                <Button
                  type="submit"
                  disabled={renderPolygons?.length <= 0}
                  className={styles.coorinatesSubmitBtn}
                  // id={styles.combinedMapSearchBtn}
                >
                  <i className="fas fa-search"></i>
                </Button>
              </Form>
            </MapControl>
          </>
        )}
      </Formik>
    </div>
  );
}

export default SearchPoints;
