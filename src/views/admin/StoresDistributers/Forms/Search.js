import React, { useEffect, useState } from "react";
import { fetchData } from "services/api.service";
import { Formik } from "formik";
import { Form, FormGroup, Input, Button } from "reactstrap";

const SearchForm = ({
  handelSearch,
  storeType,
  distributerType,
  exporterType,
}) => {
  // const [crops, setCrops] = useState([]);
  // const [governorate, setGovernorate] = useState([]);
  const [subType, setSubType] = useState({});

  // useEffect(() => {
  //   fetchData('/location', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setGovernorate(
  //         data.data.map((el, index) => (
  //           <option key={index} value={el._id}>
  //             {el.name_ar}
  //           </option>
  //         ))
  //       );
  //     });

  //   fetchData('/crop', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCrops(
  //         data.data.map((el, index) => (
  //           <option key={index} value={el._id}>
  //             {el.name_ar}
  //           </option>
  //         ))
  //       );
  //     });
  // }, []);
  function handleHubTypeChange(hubType) {
    if (hubType === "STORE") {
      setSubType(storeType);
    } else if (hubType === "DISTRIBUTER") {
      setSubType(distributerType);
    } else {
      setSubType(exporterType);
    }
  }
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    handelSearch(values);
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            hubCode: "",
            hubName: "",
            type: "",
            subType: "",
          }}
          validate={(values) => {
            const errors = {};
            return errors;
          }}
          onSubmit={handleSubmitForm}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  placeholder="كود المركز"
                  name="hubCode"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.hubCode}
                />
                {errors.hubCode && touched.hubCode && errors.hubCode}
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="اسم المركز"
                  name="hubName"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.hubName}
                />
                {/* {errors.hubName && touched.hubName && errors.hubName} */}
              </FormGroup>
              <FormGroup>
                <Input
                  id="type"
                  name="type"
                  type="select"
                  onChange={(e) => {
                    handleChange(e);
                    handleHubTypeChange(e.target.value);
                  }}
                  onBlur={handleBlur}
                  defaultValue=""
                >
                  <option value="" disabled key={700}>
                    .. اختر نوع المركز
                  </option>
                  <option value="STORE">مركز تعبئة</option>
                  <option value="DISTRIBUTER">مركز توزيع</option>
                  <option value="EXPORT">ميناء</option>
                </Input>
                {/* {touched.type && errors.type} */}
              </FormGroup>

              <FormGroup>
                <Input
                  id="subType"
                  name="subType"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue=""
                >
                  <option value="" disabled key={700}>
                    .. اختر نوع مركز التعبئة أو التنفيذ
                  </option>
                  {Object.entries(subType).map((ele, index) => {
                    return (
                      <option key={index} value={ele[0]}>
                        {ele[1]}
                      </option>
                    );
                  })}
                </Input>
                {/* {touched.subType && errors.subType} */}
              </FormGroup>

              {/* <FormGroup>
                <Input
                  id="crop"
                  name="crop"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    .. اختر المحصول
                  </option>
                  {crops}
                </Input>
                {touched.crop && errors.crop}
              </FormGroup> */}
              {/* <FormGroup>
                <Input
                  id="governorate"
                  name="governorate"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    .. اختر المحافظة
                  </option>
                  {governorate}
                </Input>
                {touched.governorate && errors.governorate}
              </FormGroup> */}

              <Button type="submit" color="primary" disabled={isSubmitting}>
                بحث
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SearchForm;
