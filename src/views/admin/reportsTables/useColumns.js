import React, { useEffect, useState } from 'react';
import exceljsMin, * as ExcelJS from 'exceljs/dist/exceljs.min';

function useColumns(key) {
  const columns = React.useMemo(() => {
    return {
      'التقرير الشامل': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
            // const crop = crops.filter((el) => el._id === values.cropId);
            let crop = [];
            values.cropId.forEach((value) => {
              crops.forEach((el) => {
                if (el._id === value) {
                  crop.push(el.name_ar);
                }
              });
            });
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
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

            //التقرير المجمع لبيانات الفحص
            worksheet.mergeCells('E1:I4');
            worksheet.getCell('E2').value = 'التقرير الشامل لبيانات الفحص';
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

            //لمحصول عنب للفترة من 2022-01-01 إلى 2022-08-01 للموسم المنتهى فى 2022
            worksheet.mergeCells('C5:N10');
            worksheet.getCell('C5').value = `لمحصول ${crop.join(
              ' و '
            )} للفترة من ${values.startDate} إلى ${
              values.endDate
            } للموسم المنتهى فى ${values.season.join('-')}`;
            worksheet.getCell('C5').alignment = {
              vertical: 'top',
              horizontal: 'center',
              wrapText: true,
            };
            worksheet.getCell('C5').font = {
              name: 'Times New Roman',
              family: 1,
              size: 20,
              underline: false,
              bold: false,
            };

            const beginRow = 12;
            let lengthsArray = [];

            const objectOrder = {
              day: null,
              date: null,
              mahaseelEngineer: null,
              plantQuarantineEngineer: null,
              visitDetails: null,
              sampleNumber: null,
              code: null,
              farmName: null,
              owner: null,
              ownerPhone: null,
              representative: null,
              representativePhone: null,
              governorate: null,
              center: null,
              hamlet: null,
              crop: null,
              requestTotalArea: null,
              requestVarieties: null,
              requestVarietiesArea: null,
              season: null,
              actualVarieties: null,
              plots: null,
              actualVarietiesArea: null, //مساحة كل قطعه
              actualTotalArea: null, //المساحة الفعلية
              NoOfLands: null,
              centerPoint: null,
              intersectionCodes: null,
              intersectionAreas: null,
            };

            const orderedData = execlData.map((el) => {
              const newObj = { ...objectOrder };
              return Object.assign(newObj, el);
            });
            orderedData.forEach((rowData, i) => {
              const row = worksheet.getRow(beginRow + i + 1);
              let counter = 0;
              lengthsArray.push([]);
              for (const key in rowData) {
                if (rowData.hasOwnProperty.call(rowData, key)) {
                  const cellData = rowData[key];
                  // lengthsArray[i].push(cellData?.toString().length);
                  // console.log(cellData);
                  // console.log(key);

                  // row.getCell(counter + 1).value = Array.isArray(cellData)
                  //   ? cellData.join('\n')
                  //   : cellData;
                  if (Array.isArray(cellData)) {
                    let strLength = cellData[0]?.toString().length;
                    for (let index = 1; index < cellData.length; index++) {
                      if (cellData[i]?.toString().length > strLength) {
                        strLength = cellData[i]?.toString().length;
                      } else {
                        continue;
                      }
                    }
                    lengthsArray[i].push(strLength);
                    row.getCell(counter + 1).value = cellData.join('\n');
                  } else if (
                    typeof cellData === 'object' &&
                    cellData !== null
                  ) {
                    lengthsArray[i].push(cellData?.toString().length);

                    let str = ``;
                    Object.entries(cellData).forEach(([key, value]) => {
                      str += `${key} : ${value} \n`;
                    });
                    row.getCell(counter + 1).value = str;
                  } else {
                    row.getCell(counter + 1).value = cellData;
                    lengthsArray[i].push(cellData?.toString().length);
                  }
                  row.getCell(counter + 1).alignment = {
                    vertical: 'top',
                    horizontal: 'center',
                    wrapText: true,
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
              { header: 'اليوم' },
              { header: 'تاريخ الفحص' },
              { header: 'مهندس محاصيل' },
              {
                header: 'مهندس الحجر الزراعي',
              },
              { header: 'تفاصيل الزيارة' },
              { header: 'رقم العينة' },
              { header: 'كود المزرعة' },
              { header: 'اسم المزرعة' },
              { header: 'المالك' },
              {
                header: 'هاتف المالك',
              },
              { header: 'المندوب' },
              {
                header: 'هاتف المندوب',
              },
              { header: 'المحافظة' },
              { header: 'المركز' },
              { header: 'القرية' },
              { header: 'المحصول' },
              { header: 'المساحة الكلية' },
              { header: 'الأصناف' },
              { header: 'المساحة' },
              { header: 'الموسم' },
              { header: 'الأصناف الفعلية' },
              { header: 'اسماء القطع للأصناف' },
              { header: 'مساحة القطع' },
              { header: 'المساحة الفعلية' },
              { header: 'عدد القطع' },
              { header: 'احداثيات المنتصف' },
              { header: 'رقم طلب التداخل' },
              { header: 'المساحة المتداخلة' },
            ];
            const headerRow = worksheet.getRow(beginRow);

            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              let fileName = `${new Date()
                .toISOString()
                .substring(0, 10)} ${crop.join('-')} التقرير الشامل.xlsx`;
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
          }
        },
        cols: [
          { Header: 'اليوم', accessor: 'day' },
          { Header: 'تاريخ الفحص', accessor: 'date' },
          { Header: 'مهندس محاصيل', accessor: 'mahaseelEngineer' },
          {
            Header: 'مهندس الحجر الزراعي',
            accessor: 'plantQuarantineEngineer',
          },
          { Header: 'تفاصيل الزيارة', accessor: 'visitDetails' },
          { Header: 'رقم العينة', accessor: 'sampleNumber' },
          { Header: 'كود المزرعة', accessor: 'code' },
          { Header: 'اسم المزرعة', accessor: 'farmName' },
          { Header: 'المالك', accessor: 'owner' },
          {
            Header: 'هاتف المالك',
            accessor: 'ownerPhone',
          },
          { Header: 'المندوب', accessor: 'representative' },
          {
            Header: 'هاتف المندوب',
            accessor: 'representativePhone',
          },
          { Header: 'المحافظة', accessor: 'governorate' },
          { Header: 'المركز', accessor: 'center' },
          { Header: 'العنوان', accessor: 'hamlet' },
          { Header: 'المحصول', accessor: 'crop' },
          { Header: 'المساحة الكلية', accessor: 'requestTotalArea' },
          { Header: 'الأصناف', accessor: 'requestVarieties' },
          { Header: 'المساحة', accessor: 'requestVarietiesArea' },

          { Header: 'الموسم', accessor: 'season' },
          { Header: 'الأصناف الفعلية', accessor: 'actualVarieties' },

          { Header: 'اسماء القطع للأصناف', accessor: 'plots' },
          { Header: 'مساحة القطع', accessor: 'actualVarietiesArea' },
          { Header: 'المساحة الفعلية', accessor: 'actualTotalArea' },
          { Header: 'عدد القطع', accessor: 'NoOfLands' },
          { Header: 'احداثيات المنتصف', accessor: 'centerPoint' },
          { Header: 'رقم طلب التداخل', accessor: 'intersectionCodes' },
          { Header: 'المساحة المتداخلة', accessor: 'intersectionAreas' },
        ],
      },
      'التقرير العام': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
            let crop = [];
            values.cropId.forEach((value) => {
              crops.forEach((el) => {
                if (el._id === value) {
                  crop.push(el.name_ar);
                }
              });
            });
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
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

            //التقرير المجمع لبيانات الفحص
            worksheet.mergeCells('E1:I4');
            worksheet.getCell('E2').value = 'التقرير المجمع لبيانات الفحص';
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

            //لمحصول عنب للفترة من 2022-01-01 إلى 2022-08-01 للموسم المنتهى فى 2022
            worksheet.mergeCells('C5:N10');
            worksheet.getCell('C5').value = `لمحصول ${crop.join(
              ' و '
            )} للفترة من ${values.startDate} إلى ${
              values.endDate
            } للموسم المنتهى فى ${values.season.join('-')}`;
            worksheet.getCell('C5').alignment = {
              vertical: 'top',
              horizontal: 'center',
              wrapText: true,
            };
            worksheet.getCell('C5').font = {
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

            const beginRow = 12;
            let lengthsArray = [];
            //final data showing
            execlData.forEach((el) => {
              // delete el.createdAt;
              delete el.cropID;
              delete el.gpxYear;
              delete el.cropName;
              delete el.Myseason;
              delete el.gpxTimestamp;
            });
            const objectOrder = {
              code: null,
              farmName: null,
              farmOwner: null,
              farmOwnerPhone: null,
              user: null,
              userPhone: null,
              governorate: null,
              center: null,
              hamlet: null,
              RequestDate: null,
              gpxDate: null,
              RequestedTotalArea: null,
              ActualTotalArea: null,
              NOPointsAfterSubtraction: null,
              NoOfLands: null,
              coordinate: null,
              lat: null,
              lng: null,
              status: null,
              createdAt: null,
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
                  // console.log(key);
                  if (key === 'createdAt') {
                    row.getCell(counter + 1).value = cellData.substring(0, 10);
                  } else {
                    row.getCell(counter + 1).value = cellData;
                  }
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
              { header: 'اسم الجهة' },
              { header: 'اسم المالك' },
              { header: 'هاتف المالك' },
              { header: 'مقدم الطلب' },
              { header: 'هاتف مقدم الطلب' },
              { header: 'المحافظة' },
              { header: 'المركز / القسم' },
              { header: 'الوحدة المحلية' },
              { header: 'تاريخ الطلب' },
              { header: 'تاريخ الفحص' },
              { header: 'المساحة في الطلب' },
              { header: 'المساحة الفعلية' },
              { header: 'عدد النقاط المساحية' },
              { header: 'عدد القطع' },
              { header: 'الاحداثيات' },
              { header: '(latitude) دائرة العرض' },
              { header: '(longitude) خط الطول' },
              { header: 'الحالة' },
              { header: 'تاريخ الانضمام' },
            ];
            const headerRow = worksheet.getRow(beginRow);
            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              let fileName = `${new Date()
                .toISOString()
                .substring(0, 10)} ${crop.join('-')} التقرير العام.xlsx`;
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
          }
        },
        cols: [
          { Header: 'رقم الطلب', accessor: 'code' },
          { Header: 'اسم الجهة', accessor: 'farmName' },
          { Header: 'اسم المالك', accessor: 'farmOwner' },
          { Header: 'هاتف المالك', accessor: 'farmOwnerPhone' },
          { Header: 'مقدم الطلب', accessor: 'user' },
          { Header: 'هاتف مقدم الطلب', accessor: 'userPhone' },
          { Header: 'المحافظة', accessor: 'governorate' },
          { Header: 'المركز / القسم', accessor: 'center' },
          { Header: 'الوحدة المحلية', accessor: 'hamlet' },
          { Header: 'تاريخ الطلب', accessor: 'RequestDate' },
          { Header: 'تاريخ الفحص', accessor: 'gpxDate' },
          { Header: 'المساحة في الطلب', accessor: 'RequestedTotalArea' },
          { Header: 'المساحة الفعلية', accessor: 'ActualTotalArea' },
          {
            Header: 'عدد النقاط المساحية',
            accessor: 'NOPointsAfterSubtraction',
          },
          { Header: 'عدد القطع', accessor: 'NoOfLands' },
          { Header: 'الاحداثيات', accessor: 'coordinate' },
          { Header: '(latitude) دائرة العرض', accessor: 'lat' },
          { Header: '(longitude) خط الطول', accessor: 'lng' },
          { Header: 'الحالة', accessor: 'status' },
          { Header: 'تاريخ الانضمام', accessor: 'createdAt' },
        ],
      },
      'تقرير المواسم': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length) {
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
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

            //التقرير المجمع لبيانات الفحص
            worksheet.mergeCells('E1:I4');
            worksheet.getCell('E2').value = 'تقرير المواسم';
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

            const beginRow = 12;
            let lengthsArray = [];
            //final data showing
            execlData.forEach((el) => {
              // delete el.createdAt;
              delete el.cropId;
            });
            //adding _ to all properies to prevent object from sorting number first
            //TODO - search how reorder object as needed
            const objectOrder = {
              cropName: null,
              total: null,
              _2020: null,
              total2020_feddan: null,
              _2021: null,
              total2021_feddan: null,
              _2022: null,
              total2022_feddan: null,
              _2023: null,
              total2023_feddan: null,
            };

            const orderedData = execlData.map((el) => {
              const newObj = { ...objectOrder };
              let newEle = {
                _2020: el['2020'],
                _2021: el['2021'],
                _2022: el['2022'],
                _2023: el['2023'],
                total: el.total,
                total2020_feddan: el.total2020_feddan,
                total2021_feddan: el.total2021_feddan,
                total2022_feddan: el.total2022_feddan,
                total2023_feddan: el.total2023_feddan,
                cropName: el.cropName,
              };
              return Object.assign(newObj, newEle);
            });

            orderedData.forEach((rowData, i) => {
              const row = worksheet.getRow(beginRow + i + 1);
              let counter = 0;
              lengthsArray.push([]);
              for (const key in rowData) {
                if (rowData.hasOwnProperty.call(rowData, key)) {
                  const cellData = rowData[key];
                  lengthsArray[i].push(cellData?.toString().length);
                  // console.log(cellData);
                  // console.log(key);

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
              { header: 'اسم المحصول' },
              { header: 'إجمالى عدد القطع' },
              { header: 'عدد القطع في موسم 2020' },
              { header: 'مساحة القطع في موسم 2020 (بالفدان)' },
              { header: 'عدد القطع في موسم 2021' },
              { header: 'مساحة القطع في موسم 2021 (بالفدان)' },
              { header: 'عدد القطع في موسم 2022' },
              { header: 'مساحة القطع في موسم 2022 (بالفدان)' },
              { header: 'عدد القطع في موسم 2023' },
              { header: 'مساحة القطع في موسم 2023 (بالفدان)' },
            ];
            const headerRow = worksheet.getRow(beginRow);
            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              let fileName = `${new Date()
                .toISOString()
                .substring(0, 10)}تقرير المواسم .xlsx`;
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
          }
        },
        cols: [
          { Header: 'اسم المحصول', accessor: 'cropName' },
          { Header: 'إجمالى عدد القطع', accessor: 'total' },

          { Header: ' عدد القطع في موسم 2020', accessor: '2020' },
          {
            Header: 'مساحة القطع في موسم 2020 (بالفدان)',
            accessor: 'total2020_feddan',
          },

          { Header: ' عدد القطع في موسم 2021', accessor: '2021' },
          {
            Header: 'مساحة القطع في موسم 2021 (بالفدان)',
            accessor: 'total2021_feddan',
          },

          { Header: ' عدد القطع في موسم 2022', accessor: '2022' },
          {
            Header: 'مساحة القطع في موسم 2022 (بالفدان)',
            accessor: 'total2022_feddan',
          },

          { Header: ' عدد القطع في موسم 2023', accessor: '2023' },
          {
            Header: 'مساحة القطع في موسم 2023 (بالفدان)',
            accessor: 'total2023_feddan',
          },
        ],
      },
      'تقرير الزيارات': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
            let crop = [];
            values.cropId.forEach((value) => {
              crops.forEach((el) => {
                if (el._id === value) {
                  crop.push(el.name_ar);
                }
              });
            });
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
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

            //التقرير المجمع لبيانات الفحص
            worksheet.mergeCells('E1:I4');
            worksheet.getCell('E2').value = 'التقرير المجمع لبيانات الفحص';
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

            //لمحصول عنب للفترة من 2022-01-01 إلى 2022-08-01 للموسم المنتهى فى 2022
            worksheet.mergeCells('C5:N10');
            worksheet.getCell('C5').value = `لمحصول ${crop.join(
              ' و '
            )} للفترة من ${values.startDate} إلى ${
              values.endDate
            } للموسم المنتهى فى ${values.season.join('-')}`;
            worksheet.getCell('C5').alignment = {
              vertical: 'top',
              horizontal: 'center',
              wrapText: true,
            };
            worksheet.getCell('C5').font = {
              name: 'Times New Roman',
              family: 1,
              size: 20,
              underline: false,
              bold: false,
            };

            const beginRow = 12;
            let lengthsArray = [];
            //final data showing
            const objectOrder = {
              code: null,
              farmName: null,
              farmOwner: null,
              farmOwnerPhone: null,
              user: null,
              userPhone: null,
              governorate: null,
              center: null,
              hamlet: null,
              RequestDate: null,
              gpxDate: null,
              RequestedTotalArea: null,
              ActualTotalArea: null,
              NOPointsAfterSubtraction: null,
              NoOfLands: null,
              coordinate: null,
              lat: null,
              lng: null,
              status: null,
              createdAt: null,
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
                  // console.log(key);
                  if (key === 'createdAt') {
                    row.getCell(counter + 1).value = cellData.substring(0, 10);
                  } else {
                    row.getCell(counter + 1).value = cellData;
                  }
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
              { header: 'اسم الجهة' },
              { header: 'اسم المالك' },
              { header: 'هاتف المالك' },
              { header: 'مقدم الطلب' },
              { header: 'هاتف مقدم الطلب' },
              { header: 'المحافظة' },
              { header: 'المركز / القسم' },
              { header: 'الوحدة المحلية' },
              { header: 'تاريخ الطلب' },
              { header: 'تاريخ الفحص' },
              { header: 'المساحة في الطلب' },
              { header: 'المساحة الفعلية' },
              { header: 'عدد النقاط المساحية' },
              { header: 'عدد القطع' },
              { header: 'الاحداثيات' },
              { header: '(latitude) دائرة العرض' },
              { header: '(longitude) خط الطول' },
              { header: 'الحالة' },
              { header: 'تاريخ الانضمام' },
            ];
            const headerRow = worksheet.getRow(beginRow);
            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              let fileName = `${new Date()
                .toISOString()
                .substring(0, 10)} ${crop.join('-')}  تقرير الزيارات.xlsx`;
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
          }
        },
        cols: [
          { Header: 'رقم الطلب', accessor: 'code' },
          { Header: 'اسم الجهة', accessor: 'farmName' },
          { Header: 'اسم المالك', accessor: 'farmOwner' },
          { Header: 'هاتف المالك', accessor: 'farmOwnerPhone' },
          { Header: 'مقدم الطلب', accessor: 'user' },
          { Header: 'هاتف مقدم الطلب', accessor: 'userPhone' },
          { Header: 'المحافظة', accessor: 'governorate' },
          { Header: 'المركز / القسم', accessor: 'center' },
          { Header: 'الوحدة المحلية', accessor: 'hamlet' },
          { Header: 'تاريخ الطلب', accessor: 'RequestDate' },
          { Header: 'تاريخ الفحص', accessor: 'gpxDate' },
          { Header: 'المساحة في الطلب', accessor: 'RequestedTotalArea' },
          { Header: 'المساحة الفعلية', accessor: 'ActualTotalArea' },
          {
            Header: 'عدد النقاط المساحية',
            accessor: 'NOPointsAfterSubtraction',
          },
          { Header: 'عدد القطع', accessor: 'NoOfLands' },
          { Header: 'الاحداثيات', accessor: 'coordinate' },
          { Header: '(latitude) دائرة العرض', accessor: 'lat' },
          { Header: '(longitude) خط الطول', accessor: 'lng' },
          { Header: 'الحالة', accessor: 'status' },
          { Header: 'تاريخ الانضمام', accessor: 'createdAt' },
        ],
      },
      'تقرير التقاطعات': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
            let crop = [];
            values.cropId.forEach((value) => {
              crops.forEach((el) => {
                if (el._id === value) {
                  crop.push(el.name_ar);
                }
              });
            });

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
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

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
            worksheet.mergeCells('C5:N10');
            worksheet.getCell('C5').value = `لمحصول ${crop.join(
              ' و '
            )} للفترة من ${values.startDate} إلى ${
              values.endDate
            } للموسم المنتهى فى ${values.season.join('-')}`;
            worksheet.getCell('C5').alignment = {
              vertical: 'top',
              horizontal: 'center',
              wrapText: true,
            };
            worksheet.getCell('C5').font = {
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

            const beginRow = 12;
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
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              let fileName = `${new Date()
                .toISOString()
                .substring(0, 10)} ${crop.join('-')} تقرير التقاطعات.xlsx`;
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
          }
        },
        cols: [
          { Header: 'رقم الطلب', accessor: 'originalCode' },
          { Header: 'اسم المزرعة', accessor: 'originalFarmName' },
          { Header: 'معرف القطعة', accessor: 'originalPiece' },
          { Header: 'رقم الطلب المتداخل معه', accessor: 'intersectedCode' },
          {
            Header: 'اسم المزرعة المتداخل معها',
            accessor: 'intersectedFarmName',
          },
          { Header: 'معرف القطعة المتداخلة', accessor: 'intersectedPiece' },
          { Header: 'نوع التداخل', accessor: 'typeOfIntersection' },
          { Header: 'مساحة القطعة', accessor: 'area' },
          { Header: 'مساحة التداخل', accessor: 'areaOfIntersection' },
          { Header: 'المساحة الصافية', accessor: 'netArea' },
        ],
      },
      'تقرير الاحداثيات': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
            let crop = [];
            values.cropId.forEach((value) => {
              crops.forEach((el) => {
                if (el._id === value) {
                  crop.push(el.name_ar);
                }
              });
            });
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
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

            const beginRow = 1;
            let lengthsArray = [];
            //final data showing

            const objectOrder = {
              code: null,
              name: null,
              lng: null,
              lat: null,
              variety: null,
              NoOfVisits: null,
              updatedAt: null,
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
                  // console.log(key);
                  row.getCell(counter + 1).value = cellData;
                  // if (key === 'createdAt') {
                  //   row.getCell(counter + 1).value = cellData?.substring(0, 10);
                  // } else {
                  //   row.getCell(counter + 1).value = cellData;
                  // }
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
              { header: 'اسم المالك' },
              { header: '(longitude) خط الطول' },
              { header: '(latitude) دائرة العرض' },
              { header: 'الصنف' },
              { header: 'عدد الزيارات' },
              { header: 'اخر تاريخ تحديث' },
            ];
            const headerRow = worksheet.getRow(beginRow);
            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              let fileName = `${new Date()
                .toISOString()
                .substring(0, 10)} ${crop.join('-')} تقرير الاحداثيات.xlsx`;
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
          }
        },
        cols: [
          { Header: 'رقم الطلب', accessor: 'code' },
          { Header: 'اسم المالك', accessor: 'name' },
          { Header: '(longitude) خط الطول', accessor: 'lng' },
          { Header: '(latitude) دائرة العرض', accessor: 'lat' },
          { Header: 'الصنف', accessor: 'variety' },
          { Header: 'عدد الزيارات', accessor: 'NoOfVisits' },
          { Header: 'اخر تاريخ تحديث', accessor: 'updatedAt' },
        ],
      },
      'تقرير البائعين': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
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

            const worksheet = workbook.addWorksheet('Sellers Sheet');
            // console.log(workbook);
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

            //التقرير المجمع لبيانات البائعين
            worksheet.mergeCells('E1:I4');
            worksheet.getCell('E2').value = 'التقرير المجمع لبيانات البائعين';
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
            worksheet.mergeCells('C5:K7');
            worksheet.getCell(
              'C5'
            ).value = ` للفترة من ${values.startDate} إلى ${values.endDate} `;
            worksheet.getCell('C5').alignment = {
              vertical: 'top',
              horizontal: 'center',
              wrapText: true,
            };
            worksheet.getCell('C5').font = {
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
              /////////////// WILL CHANGE ///////////////////////
              farmerName: null,
              farmerPhone: null,
              requestDate: null,
              farmName: null,
              farmArea: null,
              agriculturalAssociation: null,
              farmAddress: null,
              addressCoordinates: null,
              governorate: null,
              center: null,
              hamlet: null,
              cropName: null,
              cropVariety: null,
              cropQuantity: null,
              isGuest: null,
              userName: null,
              userPhone: null,
              harvestDate: null,
              status: null,
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
              /////////////// WILL CHANGE ///////////////////////
              { header: 'اسم المزارع' },
              { header: 'رقم الهاتف' },
              { header: 'تاريخ الطلب' },
              { header: 'اسم المزرعة' },
              { header: 'مساحة المزرعة' },
              { header: 'الجمعية الزراعية التابع لها' },
              { header: 'عنوان المزرعة' },
              { header: 'موقع المزرعة' },
              { header: 'المحافظة' },
              { header: 'المركز / القسم' },
              { header: 'الوحدة المحلية' },
              { header: 'المحصول' },
              { header: 'الصنف' },
              { header: 'الكمية المتوقعة' },
              { header: 'ضيف' },
              { header: 'اسم المستخدم' },
              { header: 'رقم هاتف المستخدم' },
              { header: 'تاريخ الحصاد' },
              { header: 'الحالة' },
            ];

            const headerRow = worksheet.getRow(beginRow);
            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              headerRow.height = 20;
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
              let fileName = `Sellers Table.xlsx`;

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
          }
        },
        cols: [
          { Header: 'اسم المزارع', accessor: 'farmerName' },
          { Header: 'رقم الهاتف', accessor: 'farmerPhone' },
          { Header: 'تاريخ الطلب', accessor: 'requestDate' },
          { Header: 'اسم المزرعة', accessor: 'farmName' },
          { Header: 'مساحة المزرعة', accessor: 'farmArea' },
          {
            Header: 'الجمعية الزراعية التابع لها',
            accessor: 'agriculturalAssociation',
          },
          { Header: 'عنوان المزرعة', accessor: 'farmAddress' },
          { Header: 'موقع المزرعة', accessor: 'addressCoordinates' },
          { Header: 'المحافظة', accessor: 'governorate' },
          { Header: 'المركز / القسم', accessor: 'center' },
          { Header: 'الوحدة المحلية', accessor: 'hamlet' },
          { Header: 'المحصول', accessor: 'cropName' },
          { Header: 'الصنف', accessor: 'cropVariety' },
          { Header: 'الكمية المتوقعة', accessor: 'cropQuantity' },
          { Header: 'ضيف', accessor: 'isGuest' },
          { Header: 'اسم المستخدم', accessor: 'userName' },
          { Header: 'رقم هاتف المستخدم', accessor: 'userPhone' },
          { Header: 'تاريخ الحصاد', accessor: 'harvestDate' },
          { Header: 'الحالة', accessor: 'status' },
        ],
      },
      'تقرير المشترين': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
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

            worksheet.views = [{ showGridLines: false, rightToLeft: true }];
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
            worksheet.mergeCells('C5:K7');
            worksheet.getCell(
              'C5'
            ).value = ` للفترة من ${values.startDate} إلى ${values.endDate} `;
            worksheet.getCell('C5').alignment = {
              vertical: 'top',
              horizontal: 'center',
              wrapText: true,
            };
            worksheet.getCell('C5').font = {
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
              { header: 'عنوان الاستلام' },
              { header: 'المحصول' },
              { header: 'الصنف' },
              { header: 'الكمية المطلوبة' },
            ];

            const headerRow = worksheet.getRow(beginRow);
            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
          }
        },
        cols: [
          { Header: 'اسم المشتري', accessor: 'buyerName' },
          { Header: 'رقم الهاتف', accessor: 'buyerPhone' },
          { Header: 'تاريخ الطلب', accessor: 'requestDate' },
          { Header: 'عنوان الاستلام', accessor: 'buyerAddress' },
          { Header: 'المحصول', accessor: 'crop' },
          { Header: 'الصنف', accessor: 'variety' },
          { Header: 'الكمية المطلوبة', accessor: 'quantity' },
        ],
      },
      'تقرير الأصناف': {
        execlFn: function (execlData, values, crops) {
          if (execlData.length && Object.keys(values).length) {
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
            worksheet.views = [{ showGridLines: false, rightToLeft: true }];

            const beginRow = 1;
            let lengthsArray = [];

            //final data showing
            execlData.forEach((el) => {
              delete el?._id;
            });

            const objectOrder = {
              name_ar: null,
              farmName: null,
              ownerName: null,
              ownerPhone: null,
              applicantName: null,
              applicantPhone: null,
              governorate: null,
              center: null,
              hamlet: null,
              season: null,
              status: null,
              createdAt: null,
              gpxTimestamp: null,
              updatedAt: null,
              variety: null,
              pointsCount: null,
              plotsCount: null,
              plotArea: null,
              requestArea: null,
              actualTotalArea: null,
              intersectionCount: null,
              intersectionNames: null,
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
              { header: 'اسم القطعة' },
              { header: 'اسم المزرعة' },
              { header: 'اسم المالك' },
              { header: 'رقم هاتف المالك' },
              { header: 'اسم مقدم الطلب' },
              { header: 'رقم مقدم الطلب' },
              { header: 'المحافظة' },
              { header: 'المركز / القسم' },
              { header: 'الوحدة المحلية' },
              { header: 'الموسم' },
              { header: 'حالة الطلب' },
              { header: 'تاريخ الطلب' },
              { header: 'تاريخ الفحص' },
              { header: 'تاريخ التعديل' },
              { header: 'الصنف' },
              { header: 'عدد النقاط' },
              { header: 'عدد القطع' },
              { header: 'مساحة القطعة' },
              { header: 'مساحة الطلب' },
              { header: 'المساحة الفعلية' },
              { header: 'عدد التقاطعات' },
              { header: 'المزارع المتقاطعة' },
            ];

            const headerRow = worksheet.getRow(beginRow);
            lengthsArray.push([]);
            headers.forEach((el, i) => {
              headerRow.getCell(i + 1).value = el.header;
              lengthsArray[lengthsArray.length - 1].push(
                el.header.toString().length
              );
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
              let fileName = `${new Date()
                .toISOString()
                .substring(0, 10)}   تقرير الأصناف.xlsx`;

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
          }
        },
        cols: [
          { Header: 'اسم القطعة', accessor: 'name_ar' },
          { Header: 'اسم المزرعة', accessor: 'farmName' },
          { Header: 'اسم المالك', accessor: 'ownerName' },
          { Header: 'رقم هاتف المالك', accessor: 'ownerPhone' },
          { Header: 'اسم مقدم الطلب', accessor: 'applicantName' },
          { Header: 'رقم مقدم الطلب', accessor: 'applicantPhone' },
          { Header: 'المحافظة', accessor: 'governorate' },
          { Header: 'المركز / القسم', accessor: 'center' },
          { Header: 'الوحدة المحلية', accessor: 'hamlet' },
          { Header: 'الموسم', accessor: 'season' },
          { Header: 'حالة الطلب', accessor: 'status' },
          { Header: 'تاريخ الطلب', accessor: 'createdAt' },
          { Header: 'تاريخ الفحص', accessor: 'gpxTimestamp' },
          { Header: 'تاريخ التعديل', accessor: 'updatedAt' },
          { Header: 'الصنف', accessor: 'variety' },
          { Header: 'عدد النقاط', accessor: 'pointsCount' },
          { Header: 'عدد القطع', accessor: 'plotsCount' },
          { Header: 'مساحة القطعة', accessor: 'plotArea' },
          { Header: 'مساحة الطلب', accessor: 'requestArea' },
          { Header: 'المساحة الفعلية', accessor: 'actualTotalArea' },
          { Header: 'عدد التقاطعات', accessor: 'intersectionCount' },
          { Header: 'المزارع المتقاطعة', accessor: 'intersectionNames' },
        ],
      },
      // 'تقرير الاجانب': {
      //   execlFn: function (execlData, values, crops) {
      //     if (execlData.length && Object.keys(values).length) {
      //       const crop = crops.filter((el) => el._id === values.cropId);

      //       const workbook = new ExcelJS.Workbook();
      //       workbook.views = [
      //         {
      //           x: 0,
      //           y: 0,
      //           width: 10000,
      //           height: 20000,
      //           firstSheet: 0,
      //           activeTab: 1,
      //           visibility: 'visible',
      //         },
      //       ];

      //       const worksheet = workbook.addWorksheet('buyers Sheet');
      //       // console.log(workbook);
      //       worksheet.views = [
      //         {
      //           showGridLines: false,
      //         },
      //       ];

      //       //التقرير المجمع لبيانات البائعين
      //       worksheet.mergeCells('E1:I4');
      //       worksheet.getCell('E2').value = 'Buyers Data Report';
      //       worksheet.getCell('E2').alignment = {
      //         vertical: 'top',
      //         horizontal: 'center',
      //       };
      //       worksheet.getCell('E2').font = {
      //         name: 'Times New Roman',
      //         family: 1,
      //         size: 24,
      //         underline: true,
      //         bold: true,
      //       };

      //       // للفترة من 2022-01-01 إلى 2022-08-01
      //       worksheet.mergeCells('C5:K7');
      //       worksheet.getCell(
      //         'C5'
      //       ).value = `from${values.startDate} to ${values.endDate}`;
      //       worksheet.getCell('C5').alignment = {
      //         vertical: 'top',
      //         horizontal: 'center',
      //       };
      //       worksheet.getCell('C5').font = {
      //         name: 'Times New Roman',
      //         family: 1,
      //         size: 20,
      //         underline: false,
      //         bold: false,
      //       };

      //       const beginRow = 10;
      //       let lengthsArray = [];

      //       //final data showing
      //       execlData.forEach((el) => {
      //         delete el._id;
      //       });

      //       const objectOrder = {
      //         buyerName: null,
      //         buyerPhone: null,
      //         requestDate: null,
      //         email: null,
      //         companyName: null,
      //         buyerAddress: null,
      //         crop: null,
      //         variety: null,
      //         quantity: null,
      //         quality: null,
      //         otherQuality: null,
      //         fromDate: null,
      //         ToDate: null,
      //       };

      //       const orderedData = execlData.map((el) => {
      //         const newObj = { ...objectOrder };
      //         return Object.assign(newObj, el);
      //       });

      //       // console.log(orderedData);

      //       orderedData.forEach((rowData, i) => {
      //         const row = worksheet.getRow(beginRow + i + 1);
      //         let counter = 0;
      //         lengthsArray.push([]);

      //         for (const key in rowData) {
      //           if (rowData.hasOwnProperty.call(rowData, key)) {
      //             const cellData = rowData[key];
      //             lengthsArray[i].push(cellData?.toString().length);
      //             // console.log(cellData);
      //             row.getCell(counter + 1).value = cellData;
      //             row.getCell(counter + 1).alignment = {
      //               vertical: 'top',
      //               horizontal: 'center',
      //             };
      //             row.getCell(counter + 1).font = {
      //               name: 'Times New Roman',
      //               family: 1,
      //               size: 11,
      //               underline: false,
      //               bold: false,
      //               color: { argb: '000000' },
      //             };

      //             row.getCell(counter + 1).border = {
      //               top: { style: 'thin' },
      //               left: { style: 'thin' },
      //               bottom: { style: 'thin' },
      //               right: { style: 'thin' },
      //             };
      //           }

      //           counter++;
      //         }
      //       });

      //       const headers = [
      //         { header: 'buyer name' },
      //         { header: 'phone number' },
      //         { header: 'request date' },
      //         { header: 'email' },
      //         { header: 'company name' },
      //         { header: 'address' },
      //         { header: 'crop' },
      //         { header: 'variety' },
      //         { header: 'required quantity' },
      //         { header: 'quality' },
      //         { header: 'otherQuality' },
      //         { header: 'delivery date from' },
      //         { header: 'delivery date to' },
      //       ];

      //       const headerRow = worksheet.getRow(beginRow);
      //       lengthsArray.push([]);
      //       headers.forEach((el, i) => {
      //         headerRow.getCell(i + 1).value = el.header;
      //         lengthsArray[lengthsArray.length - 1].push(
      //           el.header.toString().length
      //         );
      //         headerRow.getCell(i + 1).alignment = {
      //           vertical: 'top',
      //           horizontal: 'center',
      //         };
      //         headerRow.getCell(i + 1).font = {
      //           name: 'Times New Roman',
      //           family: 1,
      //           size: 12,
      //           underline: false,
      //           bold: true,
      //           color: { argb: 'f8f9fa' },
      //         };
      //         headerRow.getCell(i + 1).fill = {
      //           type: 'pattern',
      //           pattern: 'solid',
      //           fgColor: { argb: '16AE69' },
      //         };

      //         headerRow.getCell(i + 1).border = {
      //           top: { style: 'thin', color: { argb: 'f8f9fa' } },
      //           left: { style: 'thin', color: { argb: 'f8f9fa' } },
      //           bottom: { style: 'thin', color: { argb: 'f8f9fa' } },
      //           right: { style: 'thin', color: { argb: 'f8f9fa' } },
      //         };
      //       });

      //       //ADJUST COLUMN LENGTH
      //       // console.log(lengthsArray);
      //       worksheet.columns.forEach((column, i) => {
      //         const columnwidthsArray = lengthsArray.map((el, j) => {
      //           return el[i];
      //         });
      //         // console.log(columnwidthsArray);
      //         const maxLength = Math.max(
      //           ...columnwidthsArray.filter((v) => typeof v === 'number')
      //         );
      //         column.width = maxLength + 3;
      //       });

      //       //DOWNLOAD EXCELL
      //       workbook.xlsx.writeBuffer().then((buf) => {
      //         //  console.log(buf);
      //         const blob = new Blob([buf], {
      //           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      //         });
      //         var URL = window.URL || window.webkitURL;
      //         var downloadUrl = URL.createObjectURL(blob);
      //         let fileName = `buyers report.xlsx`;

      //         // Create download link element
      //         let downloadLink = document.createElement('a');

      //         if (downloadLink.download !== undefined) {
      //           // feature detection
      //           downloadLink.href = downloadUrl;
      //           downloadLink.setAttribute('download', fileName);
      //           downloadLink.click();
      //         } else {
      //           window.open(URL);
      //         }
      //       });
      //     }
      //   },
      //   cols: [
      //     { Header: 'buyer name', accessor: 'buyerName' },
      //     { Header: 'phone number', accessor: 'buyerPhone' },
      //     { Header: 'request date', accessor: 'requestDate' },
      //     { Header: 'email', accessor: 'email' },
      //     { Header: 'company name', accessor: 'companyName' },
      //     { Header: 'address', accessor: 'buyerAddress' },
      //     { Header: 'crop', accessor: 'crop' },
      //     { Header: 'variety', accessor: 'variety' },
      //     { Header: 'required quantity', accessor: 'quantity' },
      //     { Header: 'quality', accessor: 'quality' },
      //     { Header: 'otherQuality', accessor: 'otherQuality' },
      //     { Header: 'delivery date from', accessor: 'fromDate' },
      //     { Header: 'delivery date to', accessor: 'ToDate' },
      //   ],
      // },
    };
  }, []);

  return key
    ? columns[key]
    : {
        execlFn: function () {},
        cols: [],
      };
}

export default useColumns;
