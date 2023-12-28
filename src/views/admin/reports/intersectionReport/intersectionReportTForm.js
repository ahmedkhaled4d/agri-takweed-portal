import React, { useEffect, useState } from 'react';
import * as ExcelJS from 'exceljs/dist/exceljs.min';
import { fetchData } from 'services/api.service';
// react plugin for creating notifications over the dashboard
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button, Spinner } from 'reactstrap';
import axiosApiInstance from 'services/axios.inercept';
// import { saveAs } from 'file-saver';
import styles from '../reports.module.css';

// let excelJS;
// const lazyLoadFromCDN = (callback) => {
//   const mathJax = document.createElement('script');
//   mathJax.setAttribute(
//     'src',
//     'https://cdn.jsdelivr.net/npm/exceljs@1.12.1/dist/exceljs.min.js'
//   );
//   mathJax.addEventListener('load', () => callback());
//   document.head.appendChild(mathJax);
// };
// lazyLoadFromCDN(() => {
//   console.log(window.ExcelJS);
//   excelJS = window.ExcelJS;
// });

const IntersectionReportTForm = () => {
  const seasons = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const [crops, setCrops] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData('/crop', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
      .then((response) => response.json())
      .then((data) => {
        setCrops(data.data);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = async (values, { setSubmitting }) => {
    setSubmitting(false);
    setLoading(true);
    // console.log(values);
    const crop = crops.filter((el) => el._id === values.cropId);
    let error = false;

    for (const key in values) {
      if (values.hasOwnProperty.call(values, key)) {
        const element = values[key];
        if (!element.length > 0) {
          error = true;
        }
      }
    }

    if (error) {
      setLoading(false);
      setErrorMsg('من فضلك ادخل جميع المتطلبات');
      return;
    }
    try {
      const data = await axiosApiInstance.post(
        '/admin/report/intersection',
        values
      );
      const execlData = data.data;

      if (!execlData.length > 0) {
        setLoading(false);
        setErrorMsg('لا يوجد نتائج للبحث');
        return;
      }

      // console.log(execlData);
      const workbook = new ExcelJS.Workbook();
      workbook.views = [
        {
          x: 0,
          y: 0,
          width: 10000,
          height: 20000,
          firstSheet: 0,
          activeTab: 1,
          visibility: 'visible',
          //    showGridLines: false,
        },
      ];
      const worksheet = workbook.addWorksheet('ExampleSheet');
      // console.log(workbook);
      worksheet.views = [
        {
          showGridLines: false,
        },
      ];

      //التقرير المجمع لبيانات الفحص
      worksheet.mergeCells('D1:H4');
      worksheet.getCell('D2').value = 'تقرير التقاطعات';
      worksheet.getCell('D2').alignment = {
        vertical: 'top',
        horizontal: 'center',
      };
      worksheet.getCell('D2').font = {
        name: 'Times New Roman',
        family: 1,
        size: 24,
        underline: true,
        bold: true,
      };

      //لمحصول عنب للفترة من 2022-01-01 إلى 2022-08-01 للموسم المنتهى فى 2022
      worksheet.mergeCells('C6:K7');
      worksheet.getCell(
        'C6'
      ).value = `لمحصول ${crop[0].name_ar} للفترة من ${values.startDate} إلى ${values.endDate} للموسم المنتهى فى ${values.season}`;
      worksheet.getCell('C6').alignment = {
        vertical: 'top',
        horizontal: 'center',
      };
      worksheet.getCell('C6').font = {
        name: 'Times New Roman',
        family: 1,
        size: 20,
        underline: false,
        bold: false,
      };

      //'تَكوّيِدْ'
      // worksheet.mergeCells('T3:W4');
      // worksheet.getCell('T3').value = 'تَكوّيِدْ';
      // worksheet.getCell('T3').alignment = {
      //   vertical: 'top',
      //   horizontal: 'center',
      // };
      // worksheet.getCell('T3').font = {
      //   name: 'Times New Roman',
      //   family: 1,
      //   size: 20,
      //   underline: false,
      //   bold: false,
      // };

      const beginRow = 10;
      let lengthsArray = [];
      //final data showing
      execlData.forEach((el) => {
        delete el._id;
        //     delete el.cropID;
        //     delete el.gpxYear;
        //     delete el.cropName;
      });
      const objectOrder = {
        originalCode: null,
        originalFarmName: null,
        originalPiece: null,
        intersectedCode: null,
        intersectedFarmName: null,
        intersectedPiece: null,
        typeOfIntersection: null,
        area: null,
        areaOfIntersection: null,
        netArea: null,
      };

      const orderedData = execlData.map((el) => {
        const newObj = { ...objectOrder };
        return Object.assign(newObj, el);
      });

      // console.log(orderedData);

      orderedData.forEach((rowData, i) => {
        const row = worksheet.getRow(beginRow + i + 1);
        let counter = 0;
        lengthsArray.push([]);
        for (const key in rowData) {
          if (rowData.hasOwnProperty.call(rowData, key)) {
            const cellData = rowData[key];
            lengthsArray[i].push(cellData?.toString().length);
            // console.log(cellData);
            row.getCell(counter + 1).value = cellData;
            row.getCell(counter + 1).alignment = {
              vertical: 'top',
              horizontal: 'center',
            };
            row.getCell(counter + 1).font = {
              name: 'Times New Roman',
              family: 1,
              size: 11,
              underline: false,
              bold: false,
              color: { argb: '000000' },
            };

            row.getCell(counter + 1).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          }
          counter++;
        }
      });

      //headers showing
      const headers = [
        { header: 'رقم الطلب' },
        { header: 'اسم المزرعة' },
        { header: 'معرف القطعة' },
        { header: 'رقم الطلب المتداخل معه' },
        { header: 'اسم المزرعة المتداخل معها' },
        { header: 'معرف القطعة المتداخلة' },
        { header: 'نوع التداخل' },
        { header: 'مساحة القطعة' },
        { header: 'مساحة التداخل' },
        { header: 'المساحة الصافية' },
      ];
      const headerRow = worksheet.getRow(beginRow);
      lengthsArray.push([]);
      headers.forEach((el, i) => {
        headerRow.getCell(i + 1).value = el.header;
        lengthsArray[lengthsArray.length - 1].push(el.header.toString().length);
        headerRow.getCell(i + 1).alignment = {
          vertical: 'top',
          horizontal: 'center',
        };
        headerRow.getCell(i + 1).font = {
          name: 'Times New Roman',
          family: 1,
          size: 14,
          underline: false,
          bold: true,
          color: { argb: 'f8f9fa' },
        };
        headerRow.getCell(i + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '16AE69' },
        };

        headerRow.getCell(i + 1).border = {
          top: { style: 'thin', color: { argb: 'f8f9fa' } },
          left: { style: 'thin', color: { argb: 'f8f9fa' } },
          bottom: { style: 'thin', color: { argb: 'f8f9fa' } },
          right: { style: 'thin', color: { argb: 'f8f9fa' } },
        };
      });

      //ADJUST COLUMN LENGTH
      // console.log(lengthsArray);
      worksheet.columns.forEach((column, i) => {
        const columnwidthsArray = lengthsArray.map((el, j) => {
          return el[i];
        });
        // console.log(columnwidthsArray);
        const maxLength = Math.max(
          ...columnwidthsArray.filter((v) => typeof v === 'number')
        );
        column.width = maxLength + 3;
      });

      //download execl
      workbook.xlsx.writeBuffer().then((buf) => {
        //  saveAs(new Blob([buf]), `testFile.xlsx`);
        //  console.log(buf);
        const blob = new Blob([buf], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        //  let URL =
        //    'data:application/vnd.ms-excel' + encodeURIComponent(new Blob([buf]));
        //  URL.createObjectURL(blob);
        let fileName = `${new Date().toISOString().substring(0, 10)} ${
          crop[0].name_ar
        } تقرير التقاطعات.xlsx`;
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
      });
      setLoading(false);
      setErrorMsg('');
    } catch (err) {
      setLoading(false);
      setErrorMsg('حدث خطأ ما');
      console.log(err);
    }
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            startDate: '',
            endDate: '',
            season: '',
            cropId: '',
          }}
          validate={(values) => {
            const errors = {};
            // if (!values.startDate) {
            //   errors.startDate = 'مطلوب';
            // }
            // if (!values.endDate) {
            //   errors.endDate = 'مطلوب';
            // }
            // if (!values.season) {
            //   errors.season = 'مطلوب';
            // }
            // if (!values.cropId) {
            //   errors.cropId = 'مطلوب';
            // }

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
              <FormGroup
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <p style={{ marginTop: '0.3em' }}>من</p>
                <Input
                  name="startDate"
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.startDate}
                />
                {errors.startDate && touched.startDate && errors.startDate}
              </FormGroup>
              <FormGroup style={{ display: 'flex' }}>
                <p style={{ marginTop: '0.3em' }}>الي</p>
                <Input
                  name="endDate"
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.endDate}
                />
                {errors.endDate && touched.endDate && errors.endDate}
              </FormGroup>
              <FormGroup>
                <Input
                  id="season"
                  name="season"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    اختر الموسم
                  </option>
                  {seasons.map((el, index) => (
                    <option key={index} value={el}>
                      {el}
                    </option>
                  ))}
                </Input>
                {touched.season && errors.season}
              </FormGroup>
              <FormGroup>
                <Input
                  id="crop"
                  name="cropId"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    .. اختر المحصول
                  </option>
                  {crops
                    ?.sort((a, b) => {
                      return a.name_ar.localeCompare(b.name_ar);
                    })
                    ?.map((el, index) => (
                      <option key={index} value={el._id}>
                        {el.name_ar}
                      </option>
                    ))}
                </Input>
                {touched.cropId && errors.cropId}
              </FormGroup>
              <Button
                className={styles.formBtn}
                type="submit"
                // color="primary"
                disabled={isSubmitting}
              >
                {loading === true ? (
                  <Spinner
                    animation="border"
                    role="status"
                    style={{ width: '1.2rem', height: '1.2rem' }}
                  ></Spinner>
                ) : (
                  'اصدار'
                )}
              </Button>

              <p style={{ color: 'red' }}>{errorMsg}</p>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default IntersectionReportTForm;
