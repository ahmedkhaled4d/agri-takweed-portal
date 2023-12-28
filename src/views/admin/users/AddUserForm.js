import { Formik } from "formik";
import { Form, FormGroup, Input, Button } from "reactstrap";
import toast from "react-hot-toast";
import axios from "services/axios.inercept";
import validate from "utils/validationUtils/validation";

// const userType = [
//   { label: 'مهندس حجر زراعي', value: 'agriculturalEng' },
//   { label: 'مهندس محاصيل', value: 'mahaseelEng' },
// ];
const userType = [
  { label: "مهندس", value: "eng" },
  { label: "منسق", value: "coordinator" },
];

function AddUserForm({ load, setCurrentQuery }) {
  const handleSubmitForm = (values, { setSubmitting, resetForm }) => {
    const OTP_TOKEN = "ahmedTakweed2024";
    let { userType, ...rest } = values;
    let newValues = { ...rest, phone: `+2${rest.phone}` };
    axios
      .post(`/auth/${userType}`, newValues, {
        headers: {
          otptoken: OTP_TOKEN,
        },
      })
      .then(function (response) {
        // console.log('done', response);
        setSubmitting(false);
        toast.success("تم الاضافة بنجاح");
        //reset
        load(1, "");
        setCurrentQuery("");
        resetForm();
      })
      .catch(function (error) {
        console.log(error);
        toast.error("حدث خطا");
        setSubmitting(false);
      });

    //     setSubmitting(false);
  };

  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            name: "",
            phone: "",
            password: "",
            email: "",
            nationalId: "",
            userType: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "مطلوب*";
            }
            if (!values.phone) {
              errors.phone = "مطلوب*";
            } else if (!validate.isMobileValide(values.phone)) {
              errors.phone = "من فضلك ادخل رقم هاتف صحيح";
            }
            if (!values.password) {
              errors.password = "مطلوب*";
            }
            if (!values.userType) {
              errors.userType = "مطلوب*";
            }
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
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  placeholder="اسم المستخدم*"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />

                <span className="text-danger">
                  {errors.name && touched.name && errors.name}
                </span>
                <Input
                  placeholder="رقم التليفون*"
                  name="phone"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                />
                <span className="text-danger">
                  {errors.phone && touched.phone && errors.phone}
                </span>
                <Input
                  placeholder="كلمة المرور*"
                  name="password"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                <span className="text-danger">
                  {errors.password && touched.password && errors.password}
                </span>
                <Input
                  placeholder="البريد الالكتروني"
                  name="email"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <span className="text-danger">
                  {errors.email && touched.email && errors.email}
                </span>
                <Input
                  placeholder="الرقم القومي"
                  name="nationalId"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nationalId}
                />
                <span className="text-danger">
                  {errors.nationalId && touched.nationalId && errors.nationalId}{" "}
                </span>
              </FormGroup>

              <FormGroup>
                <Input
                  id="userType"
                  name="userType"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">نوع المستخدم</option>

                  {userType.map((el, i) => {
                    return (
                      <option key={i} value={el.value}>
                        {el.label}
                      </option>
                    );
                  })}
                </Input>
                <span className="text-danger">
                  {errors.userType && touched.userType && errors.userType}
                </span>
              </FormGroup>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                إضافة
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default AddUserForm;
