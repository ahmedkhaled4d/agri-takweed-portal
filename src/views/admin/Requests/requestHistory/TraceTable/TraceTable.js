import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import DefaultColumnFilter from './DefaultFilter';
import { Formik } from 'formik';
import axiosApiInstance from 'services/axios.inercept';
import toast, { Toaster } from 'react-hot-toast';
import styles from './traceTable.module.css';
import * as ExcelJS from 'exceljs/dist/exceljs.min';
import DownloadCert from './DownloadCert';
function TraceTable({ reqCode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorExists, setErrorExists] = useState(false);

  function execlFn(execlData) {
    if (execlData.length) {
      // const crop = crops.filter((el) => el._id === values.cropId);

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

      const worksheet = workbook.addWorksheet('Request History Sheet');
      // console.log(workbook);
      worksheet.views = [
        {
          showGridLines: false,
        },
      ];

      //التقرير المجمع لبيانات البائعين
      worksheet.mergeCells('K1:C4');
      worksheet.getCell('F2').value = `التقرير المجمع لتاريخ طلب ${reqCode}`;
      worksheet.getCell('F2').alignment = {
        vertical: 'top',
        horizontal: 'center',
      };
      worksheet.getCell('F2').font = {
        name: 'Times New Roman',
        family: 1,
        size: 24,
        underline: true,
        bold: true,
      };

      // للفترة من 2022-01-01 إلى 2022-08-01
      // worksheet.mergeCells('C6:K7');
      // worksheet.getCell(
      //   'C6'
      // ).value = ` للفترة من ${values.startDate} إلى ${values.endDate} `;
      // worksheet.getCell('C6').alignment = {
      //   vertical: 'top',
      //   horizontal: 'center',
      // };
      // worksheet.getCell('C6').font = {
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
      });

      const objectOrder = {
        /////////////// WILL CHANGE ///////////////////////
        fromHubName: null,
        toHubName: null,
        variety: null,
        amount: null,
        transactionType: null,
        transactionDate: null,
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
            // console.log(rowData);
            // console.log(key);
            lengthsArray[i].push(cellData?.toString().length);
            // console.log(Object.keys(objectOrder));
            // console.log(key);
            if (Object.keys(objectOrder).includes(key)) {
              // console.log('welcome');
              if (!cellData) row.getCell(counter + 1).value = 'المزرعة';
              else {
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
            // row.getCell(counter + 1).value = cellData;
          }
          counter++;
        }
      });

      const headers = [
        /////////////// WILL CHANGE ///////////////////////
        { header: 'من' },
        { header: 'إلى' },
        { header: 'الصنف' },
        { header: 'الكمية' },
        { header: 'نوع الحركة' },
        { header: 'تاريخ الحركة' },
        { header: 'مستند التخصيم' },
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
        column.width = maxLength + 8;
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
  }

  const initialState = useMemo(() => {
    return {
      pageSize: 10,
      pageIndex: 0,
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'من',
        accessor: 'fromHubName',
        disableFilters: true,
      },
      {
        Header: 'إلى',
        accessor: 'toHubName',
      },
      {
        Header: 'الصنف',
        accessor: 'variety',
        // Cell: EditableCell,
      },
      {
        Header: 'الكمية',
        accessor: 'amount',
        // disableFilters: true,
      },
      {
        Header: 'نوع الحركة',
        accessor: 'transactionType',
        disableFilters: true,
      },
      {
        Header: 'تاريخ الحركة',
        accessor: 'transactionDate',
        disableFilters: true,
      },
      {
        Header: 'مستند التخصيم',
        // Cell: (
        //   <i
        //     className="fas fa-qrcode"
        //     onClick={downloadCert}
        //     style={{ cursor: 'pointer' }}
        //   ></i>
        // ),
        Cell: (props) => {
          return <DownloadCert {...props} reqCode={reqCode} />;
        },
        disableFilters: true,
      },
    ],
    []
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  function getData() {
    if (reqCode) {
      axiosApiInstance

        .get(`/admin/traceability/${reqCode}/trace`)
        .then((response) => {
          // console.log(response.data.data);
          setLoading(false);
          setData(response.data.data);
        })
        .catch((e) => {
          toast.error('حدث خطأ');

          setLoading(false);
          console.error(e);
        });
    }
  }

  useEffect(() => {
    // console.log(reqCode);

    getData();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState,
      defaultColumn,
      //our own data start
      errorExists,
      setErrorExists,
      //our own data end
      showPagination: false,
      showPaginationTop: false,
      showPaginationBottom: false,
    },
    useFilters,
    useSortBy,
    usePagination
  );
  return (
    <>
      <Toaster />
      <Row>
        <Col md="12">
          {loading === true && (
            <Spinner animation="border" role="status"></Spinner>
          )}
          <Card>
            {/* <CardHeader></CardHeader> */}
            <CardBody>
              {/* <Button
                 color="dark"
                 style={{
                   width: '5rem',
                 }}
                 className={styles.filterReportBtn}
                 type="button"
               >
                 <Input
                   placeholder={pageIndex + 1}
                   className={` shadow-none ${styles.inputInsideBtn}`}
                   defaultValue={pageIndex + 1}
                   onChange={(e) => {
                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
                     gotoPage(page);
                   }}
                 />
               </Button> */}

              {/* <Button
                 color="dark"
                 className={styles.filterReportBtn}
                 type="button"
               >
                 <select
                   value={pageSize}
                   onChange={(e) => {
                     setPageSize(Number(e.target.value));
                   }}
                   className={styles.inputInsideBtn}
                   style={{
                     padding: '0.9em',
                     color: 'white',
                     cursor: 'pointer',
                   }}
                 >
                   {[10, 20, 30, 40, 50].map((pageSize) => (
                     <option
                       key={pageSize}
                       value={pageSize}
                       style={{ backgroundColor: '#66615B' }}
                     >
                       إظهار {pageSize} نتائج في الصفحة
                     </option>
                   ))}
                 </select>
               </Button> */}

              <Button
                color="dark"
                style={{
                  // width: '5rem',

                  padding: '0.9em',
                  cursor: 'auto',
                }}
                className={styles.filterReportBtn}
                type="button"
              >
                {`إجمالي عدد العمليات ${data.length}`}
              </Button>
              <Button
                color="success"
                style={{
                  // width: '5rem',
                  padding: '0.9em',
                  cursor: 'pointer',
                  color: '#000',
                }}
                // className={styles.filterReportBtn}
                type="button"
                onClick={() => {
                  execlFn(data);
                }}
              >
                تحميل ملف إكسل
              </Button>
              <button
                className="btn btn-dark"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {'<<'}
              </button>

              <button
                className="btn btn-dark"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {'>>'}
              </button>
              <Table
                responsive
                {...getTableProps()}
                className={`${styles.reportsTablesTd} text-right`}
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{ backgroundColor: '#bbe9cbb5' }}
                        >
                          {column.render('Header')}

                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <i className="mr-2 fas fa-long-arrow-alt-down"></i>
                              ) : (
                                <i className="mr-2 fas fa-long-arrow-alt-up"></i>
                              )
                            ) : (
                              <i className="mr-2 fas fa-arrows-alt-v"></i>
                            )}
                          </span>
                          <div>
                            {column.canFilter ? column.render('Filter') : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
                    prepareRow(row);

                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, itr) => {
                          // console.log(cell);
                          if (itr === 0) {
                            return (
                              <td {...cell.getCellProps()}>
                                {!cell.value ? 'المزرعة' : cell.render('Cell')}
                              </td>
                            );
                          } else if (itr === 1) {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.value.replace('_', ' ')}
                                {/* {cell.render("Cell")} */}
                              </td>
                            );
                          } else if (itr === 4) {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.value === 'CHARGE_TO_STORE'
                                  ? 'من المزرعة لمركز التعبئة'
                                  : cell.value === 'STORE_TO_DISTRIBUTER'
                                  ? 'من مركز التعبئة إلى مركز التوزيع'
                                  : 'من مركز التوزيع إلى الميناء'}
                              </td>
                            );
                          } else if (itr === 5) {
                            return (
                              <td {...cell.getCellProps()}>
                                {/* {cell.value.substring(0, 10)} */}
                                {cell.render('Cell')}
                              </td>
                            );
                          } else {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.render('Cell')}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
            <CardFooter>
              {/* <span>
                 صفحة{' '}
                 <strong>
                   {pageIndex + 1} من {pageOptions.length}
                 </strong>
               </span> */}
            </CardFooter>
          </Card>
        </Col>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
        {/* <div className="pagination">
           <button
             className="btn btn-success text-dark"
             onClick={() => gotoPage(0)}
             disabled={!canPreviousPage}
           >
             {'<<'}
           </button>
           <button
             className="btn btn-dark"
             onClick={() => previousPage()}
             disabled={!canPreviousPage}
           >
             السابق
           </button>
   
           <button
             className="btn btn-dark"
             onClick={() => nextPage()}
             disabled={!canNextPage}
           >
             التالى
           </button>
           <button
             className="btn btn-success text-dark"
             onClick={() => gotoPage(pageCount - 1)}
             disabled={!canNextPage}
           >
             {'>>'}
           </button>
         </div> */}
      </Row>
    </>
  );
}

export default TraceTable;
