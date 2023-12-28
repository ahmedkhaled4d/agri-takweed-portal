import React, { useEffect, useState } from 'react';

// react plugin for creating notifications over the dashboard
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axiosApiInstance from 'services/axios.inercept';
import { Toaster, toast } from 'react-hot-toast';
// import { useHistory } from 'react-router';

export default function TemplateForm({ toggleTemplateModal }) {
  const [crops, setCrops] = useState([]);
  const [downloadTemplateBtnLoading, setDownloadTemplateBtnLoading] =
    useState(false);

  // const history = useHistory();
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    setDownloadTemplateBtnLoading(true);
    // history.push({
    //   state: 'test',
    //   pathname: '/admin/requests/viewRequests',
    // });
    axiosApiInstance
      .get(`/admin/request/excel-data/template/${values.cropId}`, {
        responseType: 'blob',
      })
      .then((res) => {
        // console.log(res);
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        let fileName = `template-${new Date()
          .toISOString()
          .substring(0, 10)}.xlsx`;

        // Create download link element
        let downloadLink = document.createElement('a');

        if (downloadLink.download !== undefined) {
          // feature detection
          downloadLink.href = downloadUrl;
          downloadLink.setAttribute('download', fileName);
          downloadLink.click();
        } else {
          window.open(URL);
        }
        setDownloadTemplateBtnLoading(false);
        toast.success('تم التنزيل بنجاح ...');
        toggleTemplateModal();
      })
      .catch((e) => {
        console.log(e);
        toast.error('حدث خطأ ...');
        setDownloadTemplateBtnLoading(false);
      });
  };
  useEffect(() => {
    axiosApiInstance
      .get('/admin/crop')
      .then((res) => setCrops(res.data.data))
      .catch((e) => console.log(e));
  }, []);
  return (
    <>
      <Toaster />
      <div className="content">
        <Formik
          initialValues={{
            cropId: '',
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
                  id="cropId"
                  name="cropId"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    .. اختر المحصول
                  </option>
                  {crops.map((crop) => (
                    <option key={crop._id} value={crop._id}>
                      {crop.name_ar}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              <Button
                type="submit"
                className="d-block m-auto"
                color="info"
                disabled={isSubmitting || downloadTemplateBtnLoading}
              >
                تنزيل
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
