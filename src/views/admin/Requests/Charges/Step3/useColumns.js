import React from 'react';
import * as ExcelJS from 'exceljs/dist/exceljs.min';
import EditableCell from '../EditableCell';

function useColumns(key) {
  const columns = React.useMemo(
    () => [
      // {
      //   Header: 'كود المجمع',
      //   accessor: 'hubId',
      // },
      // {
      //   Header: 'كود المجمع',
      //   accessor: 'hubCode',
      // },
      // {
      //   Header: 'اسم المجمع',
      //   accessor: 'hubName',
      // },
      // {
      //   Header: 'المحصول',
      //   accessor: 'crop',
      // },
      {
        Header: 'الصنف',
        accessor: 'variety',
      },
      {
        Header: 'الكمية المتاحة (بالفدان)',
        accessor: 'amount',
      },
      {
        Header: 'الكمية المطلوبة (بالفدان)',
        accessor: 'amountToAdd',
        Cell: EditableCell,
      },
    ],
    []
  );

  // const columns = React.useMemo(() => {
  //   return {
  //     'main': {
  //       cols: [
  //         { Header: 'رقم الطلب', accessor: 'code' },
  //         { Header: 'اسم الجهة', accessor: 'farmName' },
  //         { Header: 'اسم المالك', accessor: 'farmOwner' },
  //         { Header: 'هاتف المالك', accessor: 'farmOwnerPhone' },
  //         { Header: 'مقدم الطلب', accessor: 'user' },
  //         { Header: 'هاتف مقدم الطلب', accessor: 'userPhone' },
  //         { Header: 'المحافظة', accessor: 'governorate' },
  //         { Header: 'المركز / القسم', accessor: 'center' },
  //         { Header: 'الوحدة المحلية', accessor: 'hamlet' },
  //         { Header: 'تاريخ الطلب', accessor: 'RequestDate' },
  //         { Header: 'تاريخ الفحص', accessor: 'gpxDate' },
  //         { Header: 'المساحة في الطلب', accessor: 'RequestedTotalArea' },
  //         { Header: 'المساحة الفعلية', accessor: 'ActualTotalArea' },
  //         {
  //           Header: 'عدد النقاط المساحية',
  //           accessor: 'NOPointsAfterSubtraction',
  //         },
  //         { Header: 'عدد القطع', accessor: 'NoOfLands' },
  //         { Header: 'الاحداثيات', accessor: 'coordinate' },
  //         { Header: '(latitude) دائرة العرض', accessor: 'lat' },
  //         { Header: '(longitude) خط الطول', accessor: 'lng' },
  //         { Header: 'الحالة', accessor: 'status' },
  //         { Header: 'تاريخ الانضمام', accessor: 'createdAt' },
  //       ],
  //     },
  //   };
  // }, []);

  // return key
  //   ? columns[key]
  //   : {
  //       execlFn: function () {},
  //       cols: [],
  //     };

  return { cols: columns };
}

export default useColumns;
