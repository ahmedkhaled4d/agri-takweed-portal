import React, { useState } from 'react';
import * as ExcelJS from 'exceljs/dist/exceljs.min';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button, Spinner } from 'reactstrap';
import axiosApiInstance from 'services/axios.inercept';
import styles from '../reports.module.css';

const PurchasesReportForm = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitForm = async (values, { setSubmitting }) => {
    setSubmitting(false);
    setLoading(true);
    // console.log(values);
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
      const data = await axiosApiInstance.post('/admin/report/buy', values);
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
        },
      ];

      const worksheet = workbook.addWorksheet('buyers Sheet');
      // console.log(workbook);
      worksheet.views = [
        {
          showGridLines: false,
        },
      ];

      //التقرير المجمع لبيانات البائعين
      worksheet.mergeCells('E1:I4');
      worksheet.getCell('E2').value = 'التقرير المجمع لبيانات المشترين';
      worksheet.getCell('E2').alignment = {
        vertical: 'top',
        horizontal: 'center',
      };
      worksheet.getCell('E2').font = {
        name: 'Times New Roman',
        family: 1,
        size: 24,
        underline: true,
        bold: true,
      };

      // للفترة من 2022-01-01 إلى 2022-08-01
      worksheet.mergeCells('C6:K7');
      worksheet.getCell(
        'C6'
      ).value = ` للفترة من ${values.startDate} إلى ${values.endDate} `;
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

      const beginRow = 10;
      let lengthsArray = [];

      //final data showing
      execlData.forEach((el) => {
        delete el._id;
      });

      const objectOrder = {
        buyerName: null,
        buyerPhone: null,
        requestDate: null,
        // governorateName: null,
        // centerName: null,
        // hamletName: null,
        buyerAddress: null,
        // activityType: null,
        // stationName: null,
        crop: null,
        variety: null,
        quantity: null,
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

      const headers = [
        { header: 'اسم المشتري' },
        { header: 'رقم الهاتف' },
        { header: 'تاريخ الطلب' },
        // { header: 'المحافظة' },
        // { header: 'المركز / القسم' },
        // { header: 'الوحدة المحلية' },
        { header: 'عنوان الاستلام' },
        // { header: 'نوع النشاط' },
        // { header: 'اسم المحطة' },
        { header: 'المحصول' },
        { header: 'الصنف' },
        { header: 'الكمية المطلوبة' },
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

      //DOWNLOAD EXCELL
      workbook.xlsx.writeBuffer().then((buf) => {
        //  console.log(buf);
        const blob = new Blob([buf], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        let fileName = `buyers Table.xlsx`;

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
          initialValues={{ startDate: '', endDate: '' }}
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

              <Button
                className={styles.formBtn}
                type="submit"
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

export default PurchasesReportForm;
