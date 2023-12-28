import React from "react";
import { Form, Button, Input} from "reactstrap";
import { Formik, Field } from "formik";
import styles from "./form.module.css";
import SelectEngineers from "./SelectEngineers";

export default function SearchForm({ handelSearch }) {
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    handelSearch(values)
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            code: "",
            committeeDate: "",
            eng: "",
          }}
          onSubmit={handleSubmitForm}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <table
                className={` mx-3 ${styles.tableForm}`}
                style={{ width: "100%", border: "none" }}
              >
                <tbody>
                  <tr className={styles.tableForm}>
                    <td className={styles.tableTd}> كود اللجنة</td>
                    <td className={styles.tableTd}>
                      <Input
                        id="code"
                        name="code"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.farmOwner}
                        className={styles.inputField}
                      />

                    </td>
                  </tr>
                  <tr className={styles.tableForm}>
                    <td className={styles.tableTd}>التاريخ</td>
                    <td className={styles.tableTd}>
                      <Field
                        type="date"
                        name="committeeDate"
                        id="committeeDate"
                        className={styles.inputField}
                      />
   
                    </td>
                  </tr>
                  <tr className={styles.tableForm}>
                    <td className={styles.tableTd}>مهندس</td>
                    <td className={styles.tableTd}>
                      <SelectEngineers setFieldValue={setFieldValue} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                بحث
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
