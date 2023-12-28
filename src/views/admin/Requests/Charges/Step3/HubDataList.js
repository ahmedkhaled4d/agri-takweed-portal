import React, { useEffect, useMemo, useState } from 'react';
import styles from '../charges.module.css';
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
  Table,
} from 'reactstrap';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import DefaultColumnFilter from '../DefaultFilter';
import EditableCell from '../EditableCell';
import { Formik } from 'formik';
import axiosApiInstance from 'services/axios.inercept';
import toast from 'react-hot-toast';

const stepNum = '3';

function SubmitForm({
  farmStorageDataToSent,
  reqCode,
  selectedHub,
  getData,
  errorExists,
  loading
  // updateHubDataToShow,
}) {
  console.log(farmStorageDataToSent);
  const [hubs, setHubs] = useState([]);

  const dataChanged = useMemo(() => {
    const foundChange = farmStorageDataToSent?.find((el) => {
      return Number(el.amountToAdd) !== 0;
    });
    console.log(foundChange);
    return foundChange ? true : false;
  }, [farmStorageDataToSent]);

  useEffect(() => {
    axiosApiInstance.get('/admin/hub?type=DISTRIBUTE').then((res) => {
      console.log(res);
      console.log(res.data.data);
      setHubs(res.data.data);
    });
  }, []);

  const handleSubmitForm = (values, { setSubmitting, resetForm }) => {
    if (!errorExists) {
      const data = farmStorageDataToSent
        .map((el) => {
          return {
            variety: el.variety,
            amountToAdd: el.amountToAdd,
          };
        })
        .filter((el) => el.amountToAdd !== '0');
      console.log(data);
      axiosApiInstance
        .post(
          `/admin/traceability/${reqCode}/${selectedHub.storeId}/distribute/${values.hub}`,
          data
        )
        .then((response) => {
          setSubmitting(false);
          toast.success('تم الارسال بنجاح');
          // resetForm();
          getData();
          // updateHubDataToShow();
        })
        .catch((e) => {
          toast.error('Error');
          console.error(e);
          setSubmitting(false);
        });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          hub: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.hub) {
            errors.hub = "مطلوب";
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
          <Form className={styles.ReportsTableButtons} onSubmit={handleSubmit}>
            <Row
              className="justify-content-center align-items-center"
              style={{ columnGap: "2em" }}
            >
              {/* <FormGroup>
                <Input
                  bsSize="lg"
                  placeholder="اسم المزرعة"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                <span className="text-danger">
                  {errors.name && touched.name && errors.name}
                </span>
              </FormGroup> */}

              <FormGroup className="mb-0">
                <Input
                  bsSize="lg"
                  id="hub"
                  name="hub"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.hamlet}
                >
                  <option key={700} value="">
                    ... اختار مركز التوزيع
                  </option>
                  {hubs
                    ?.sort((a, b) => {
                      return a.hubName.localeCompare(b.hubName);
                    })
                    ?.map((el) => (
                      <option key={el._id} value={el._id}>
                        {el.hubName}
                      </option>
                    ))}
                </Input>
                <span className="text-danger">
                  {errors.hub && touched.hub && errors.hub}
                </span>
              </FormGroup>
              <Button
                className={styles.submitButton}
                color="danger"
                type="submit"
                disabled={isSubmitting || !dataChanged || errorExists}
              >
              إرسال
              </Button>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}

function HubDataList({
  hubDataToShow,
  reqCode,
  getData,
  selectedHub,
  // updateHubDataToShow,
}) {
  const [data, setData] = useState([]);
  const [errorExists, setErrorExists] = useState(false);

  const initialState = useMemo(() => {
    return {
      pageSize: 10,
      pageIndex: 0,
    };
  }, []);

  useEffect(() => {
    // console.log(hubDataToShow);
    if (
      hubDataToShow &&
      hubDataToShow.holder &&
      hubDataToShow.holder.length > 0
    ) {
      const dataShape = hubDataToShow.holder?.map((el) => {
        return { ...el, amountToAdd: '0' };
      });
      // console.log(dataShape);
      if (dataShape) setData(dataShape);
    }
  }, [hubDataToShow]);

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

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  function updateMyData(rowIndex, columnId, newValue) {
    // setSkipPageReset(true);
    setData((prev) =>
      prev.map((row, index) => {
        if (index === rowIndex) {
          console.log(row);
          return {
            ...prev[rowIndex],
            [columnId]: newValue,
            // currentAmount: Number(row.currentAmount) - Number(newValue),
          };
        }
        return row;
      })
    );
  }

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
      updateMyData,
      stepNum,
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

  // if (hubDataToShow.length === 0) return <p>لا يوجد بيانات</p>;

  return (
    <Row>
      <Col md="12">
        <Card>
          {/* <CardHeader></CardHeader> */}
            <SubmitForm
              farmStorageDataToSent={data}
              reqCode={reqCode}
              getData={getData}
              // updateHubDataToShow={updateHubDataToShow}
              errorExists={errorExists}
              selectedHub={selectedHub}
            />
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
                padding: "0.9em",
                cursor: "auto",
              }}
              className={styles.filterReportBtn}
              type="button"
            >
              {`إجمالي عدد الاصناف ${data.length}`}
            </Button>
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
                        style={{ backgroundColor: "#bbe9cbb5" }}
                      >
                        {column.render("Header")}

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
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  console.log(row);
                  return (
                    <tr {...row.getRowProps()} key={row?.id}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
          {/* <CardFooter> */}
          {/* <span>
              صفحة{' '}
              <strong>
                {pageIndex + 1} من {pageOptions.length}
              </strong>
            </span> */}

          {/* </CardFooter> */}
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
  );
}

export default HubDataList;
