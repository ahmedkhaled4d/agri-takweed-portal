import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Button } from 'reactstrap';
import axiosApiInstance from 'services/axios.inercept';
import styles from './addRequest.module.css';
import LocationSelection from './formComponents/LocationSelection';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import * as ExcelJS from 'exceljs/dist/exceljs.min';
import FarmInputs from './formComponents/FarmInputs';
import CropInputs from './formComponents/CropInputs';

function splitString(str) {
  return str
    ?.split('-')
    .map((ele) => ele.trim())
    .filter((ele) => ele);
}
const totalDataSchema = {
  dayOfWeek: '',
  date: '',
  mahaseelEngineer: '',
  plantQuarantineEngineer: '',
  visitDetails: '',
  sampleNumber: '',
  farmName: '',
  owner: '',
  ownerPhone: '',
  representative: '',
  representativePhone: '',
  governorate: '',
  center: '',
  hamlet: '',
  crop: '',
  totalArea: '',
  varieties: '',
  area: '',
  season: '',
};
const addRequestValidationSchema = Yup.object().shape({
  totalData: Yup.array().of(
    Yup.object().shape({
      dayOfWeek: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      date: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      mahaseelEngineer: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      plantQuarantineEngineer: Yup.string()
        .typeError('* مطلوب')
        .required('* مطلوب'),
      visitDetails: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      sampleNumber: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      farmName: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      owner: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      ownerPhone: Yup.string()
        .typeError('* مطلوب')
        .required('* مطلوب')
        .matches(/^01[0125][0-9]{8}$/, 'من فضلك ادخل رقم صحيح'),
      representative: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      representativePhone: Yup.string()
        .typeError('* مطلوب')
        .required('* مطلوب')
        .matches(/^01[0125][0-9]{8}$/, 'من فضلك ادخل رقم صحيح'),
      governorate: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      center: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      hamlet: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      crop: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      totalArea: Yup.number().typeError('* مطلوب').required('* مطلوب'),
      varieties: Yup.string().typeError('* مطلوب').required('* مطلوب'),
      area: Yup.string()
        .typeError('* مطلوب')

        .required('* مطلوب')
        .when('varieties', (varieties, field) => {
          return field.test({
            test: (area) => {
              if (
                splitString(varieties)?.length !== splitString(area)?.length
              ) {
                return false;
              } else {
                return true;
              }
            },
            message: 'يجب ادخال نفس عدد بيانات الاصناف',
          });
        })
        .test('is-numberarea', 'يجب ادخال ارقام فقط', (value, context) => {
          let errorr = true;
          splitString(value)?.forEach((el) => {
            // console.log(el)
            // console.log(isNaN(Number(el)))
            if (isNaN(Number(el))) errorr = false;
          });
          return errorr;
        }),
      season: Yup.string().typeError('* مطلوب').required('* مطلوب'),
    })
  ),
});

const AddRequestForm = ({ requests }) => {
  const formikRef = useRef(null);

  //if user refreches the page ,get data from localstorage
  const initialLocalStorageData = JSON.parse(
    localStorage.getItem('adminAddTakweedRequests')
  );

  useEffect(() => {
    //if user uploaded excel ,store it in localStorage
    if (requests.length > 0) {
      localStorage.setItem('adminAddTakweedRequests', JSON.stringify(requests));

      //if user refreches the page ,validate data which comes from localStorage
    } else if (initialLocalStorageData?.length > 0) {
      formikRef.current.validateForm();
    }
  }, [requests]);

  function handleSubmitForm(values, { setSubmitting, resetForm }) {
    // get shallow copy of nested object
    // to avoid changing in formik values object structure
    // because of validation (we validate varities and area as string ..
    // and we want to change their structure to arrays )
    const finalValues = JSON.parse(JSON.stringify(values));

    finalValues.totalData.forEach((schemaObj) => {
      schemaObj.varieties = splitString(schemaObj.varieties);
      schemaObj.area = splitString(schemaObj.area);
    });

    async function handleSubmitExecl() {
      try {
        const data = await axiosApiInstance.post(
          '/admin/request/excel-data/create',
          finalValues
        );
        // console.log(data);
        const execlData = data?.data?.totalData;

        const workbook = new ExcelJS.Workbook();
        workbook.views = [
          {
            x: 0,
            y: 0,
            rightToLeft: true,
            width: 10000,
            height: 20000,
            firstSheet: 0,
            activeTab: 1,
            visibility: 'visible',
          },
        ];

        const worksheet = workbook.addWorksheet('requests Sheet');
        // console.log(workbook);
        worksheet.views = [{ showGridLines: true, rightToLeft: true }];
        worksheet.pageSetup.fitToPage = true;

        //delete unused properties
        execlData.forEach((el) => {
          delete el.center;
          delete el.crop;
          delete el.governorate;
          delete el.hamlet;
          delete el.index;
          delete el._id;
        });

        //specify order of columns while displaying each row
        const objectOrder = {
          dayOfWeek: null,
          date: null,
          mahaseelEngineer: null,
          plantQuarantineEngineer: null,
          visitDetails: null,
          sampleNumber: null,
          inputCode: null,
          code: null,
          farmName: null,
          owner: null,
          ownerPhone: null,
          representative: null,
          representativePhone: null,
          governorateName: null,
          centerName: null,
          hamletName: null,
          cropName: null,
          totalArea: null,
          varieties: null,
          area: null,
          season: null,
        };

        //assign incoming values to ordred data
        const orderedData = execlData.map((el) => {
          const newObj = { ...objectOrder };
          return Object.assign(newObj, el);
        });

        const beginRow = 2; //start from row 2 in excel as row 1 is the header
        let lengthsArray = [];

        orderedData.forEach((rowData, i) => {
          const row = worksheet.getRow(beginRow + i);
          let counter = 0;
          lengthsArray.push([]);

          for (const key in rowData) {
            if (rowData.hasOwnProperty.call(rowData, key)) {
              const cellData = rowData[key];
              lengthsArray[i].push(cellData?.toString().length);
              // console.log(cellData);
              row.getCell(counter + 1).value = Array.isArray(cellData)
                ? cellData.join('\n')
                : cellData;
              // console.log(row.getCell(counter + 1).value);
              row.getCell(counter + 1).alignment = {
                vertical: 'top',
                horizontal: 'center',
                wrapText: true,
              };
            }

            counter++;
          }
        });

        // add headers and syle it
        worksheet.columns = [
          { header: 'اليوم', key: 'dayOfWeek', width: 14 },
          { header: 'التاريخ', key: 'date', width: 20 },
          { header: 'مهندس محاصيل', key: 'mahaseelEngineer', width: 20 },
          {
            header: 'مهندس الحجر الزراعي',
            key: 'plantQuarantineEngineer',
            width: 24,
          },
          { header: 'تفاصيل الزيارة', key: 'visitDetails', width: 20 },
          { header: 'رقم العينة', key: 'sampleNumber', width: 10 },
          { header: 'كود محاصيل', key: 'inputCode', width: 20 },
          { header: 'كود المزرعة', key: 'code', width: 20 },
          { header: 'اسم المزرعة', key: 'farmName', width: 20 },
          { header: 'المالك', key: 'owner', width: 20 },
          {
            header: 'هاتف المالك',
            key: 'ownerPhone',
            width: 20,
          },
          { header: 'المندوب', key: 'representative', width: 20 },
          {
            header: 'هاتف المندوب',
            key: 'representativePhone',
            width: 24,
          },
          { header: 'المحافظة', key: 'governorateName', width: 20 },
          { header: 'المركز', key: 'centerName', width: 20 },
          { header: 'العنوان', key: 'hamletName', width: 20 },
          { header: 'المحصول', key: 'cropName', width: 20 },
          { header: 'المساحة الكلية', key: 'totalArea', width: 20 },
          { header: 'الأصناف', key: 'varieties', width: 20 },
          { header: 'المساحة', key: 'area', width: 20 },
          { header: 'الموسم', key: 'season', width: 20 },
        ];

        const headersRow = worksheet.getRow(1);
        headersRow.font = { bold: true };
        headersRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'b4c7e7' },
        };
        headersRow.alignment = {
          vertical: 'top',
          horizontal: 'center',
        };

        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        for (const letter of letters) {
          headersRow.getCell(letter).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '92d050' },
          };
        }

        //ADJUST COLUMN LENGTH
        // console.log(lengthsArray);
        // worksheet.columns.forEach((column, i) => {
        //   const columnwidthsArray = lengthsArray.map((el, j) => {
        //     return el[i];
        //   });
        //   // console.log(columnwidthsArray);
        //   const maxLength = Math.max(
        //     ...columnwidthsArray.filter((v) => typeof v === 'number')
        //   );
        //   column.width = maxLength + 3;
        // });

        //download excel
        workbook.xlsx.writeBuffer().then((buf) => {
          const blob = new Blob([buf], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);
          let fileName = `${new Date()
            .toISOString()
            .substring(0, 10)} execl.xlsx`;

          // create download link element
          let downloadLink = document.createElement('a');

          if (downloadLink.download !== undefined) {
            // feature detection
            downloadLink.href = downloadUrl;
            downloadLink.setAttribute('download', fileName);
            downloadLink.click();
          } else {
            window.open(URL);
          }
        });

        toast.success('تم التسجيل بنجاح');
        setSubmitting(false);
        resetForm({ values: { totalData: [totalDataSchema] } });
        localStorage.removeItem('adminAddTakweedRequests');
      } catch (e) {
        setSubmitting(false);
        console.error(e);
        console.error(e.response?.data.message);
        toast.error('حدث خطأ');
      }
    }

    handleSubmitExecl();

    // console.log(finalValues);
  }
  return (
    <>
      <Toaster />
      <Formik
        innerRef={formikRef}
        initialValues={{
          totalData:
            requests?.length > 0
              ? requests
              : initialLocalStorageData?.length > 0
              ? initialLocalStorageData
              : [totalDataSchema],
        }}
        enableReinitialize
        onSubmit={handleSubmitForm}
        validationSchema={addRequestValidationSchema}
        render={({ values, isSubmitting }) => (
          <Form style={{ marginTop: '2em' }}>
            <FieldArray
              name="totalData"
              render={(arrayHelpers) => (
                <div>
                  {values.totalData.map((data, index) => (
                    <div
                      key={index}
                      className={styles.eachFormWrapper + ' m-3'}
                    >
                      <span className={styles.formNum}>{data?.index}</span>

                      {/* dayOfWeek , date , mahaseelEngineer , plantQuarantineEngineer , visitDetails , sampleNumber , farmName , owner , ownerPhone , representative , representativePhone*/}
                      <FarmInputs index={index} data={data} />

                      {/* governorate & center & hamlet */}
                      <LocationSelection index={index} data={data} />

                      {/* crops , totalArea , varieties , area , season */}
                      <CropInputs index={index} data={data} />
                      {arrayHelpers.form.values.totalData.length !== 1 ? (
                        <Button
                          type="button"
                          onClick={() => {
                            arrayHelpers.remove(index);

                            const ls = JSON.parse(
                              localStorage.getItem('adminAddTakweedRequests')
                            );
                            // console.log(ls);
                            const newLs = ls.filter((el, i) => {
                              return i !== index;
                            });

                            localStorage.setItem(
                              'adminAddTakweedRequests',
                              JSON.stringify(newLs)
                            );
                            // console.log(values.totalData);
                          }}
                        >
                          X
                        </Button>
                      ) : (
                        ''
                      )}
                      <Button
                        type="button"
                        style={{ background: 'red' }}
                        onClick={(e) => {
                          arrayHelpers.push(totalDataSchema);
                          e.preventDefault();
                          localStorage.setItem(
                            'adminAddTakweedRequests',
                            JSON.stringify(values.totalData)
                          );
                        }}
                        // disabled={isSubmitting}
                      >
                        اضافة +
                      </Button>
                    </div>
                  ))}
                  <div className="container" style={{ display: 'flex' }}>
                    <Button
                      type="submit"
                      style={{
                        margin: 'auto',
                        fontSize: '1.2rem',
                        backgroundColor: 'forestgreen',
                      }}
                      disabled={isSubmitting}
                    >
                      تسجيل
                    </Button>
                  </div>
                </div>
              )}
            />
          </Form>
        )}
      />
    </>
  );
};

//prevent component from rerendreing
export default React.memo(AddRequestForm);
