import React, { useEffect, useMemo, useState } from "react";
import styles from "./charges.module.css";
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
} from "reactstrap";
import { useTable, usePagination, useSortBy, useFilters } from "react-table";
import DefaultColumnFilter from "./DefaultFilter";
import EditableCell from "./EditableCell";
import { Formik } from "formik";
import axiosApiInstance from "services/axios.inercept";
import toast from "react-hot-toast";

// const originalData = [
//   {
//     area: 'hkjh',
//     variety: 'hkjh',
//     currentAmount: '56',
//     amountToAdd: '0',
//   },
//   {
//     area: 'hkjh',
//     variety: 'hkjh',
//     currentAmount: '56',
//     amountToAdd: '0',
//   },
//   {
//     area: 'hkjh',
//     variety: 'hkjh',
//     currentAmount: '56',
//     amountToAdd: '0',
//   },
//   {
//     area: 'hkjh',
//     variety: 'hkjh',
//     currentAmount: '56',
//     amountToAdd: '0',
//   },
// ];
const stepNum = "2";
function SubmitForm({ farmStorageDataToSent, reqCode, getData, errorExists }) {
  // console.log('SubmitForm', farmStorageDataToSent);
  const [hubs, setHubs] = useState([]);
  const dataChanged = useMemo(() => {
    const foundChange = farmStorageDataToSent?.find((el) => {
      return Number(el.amountToAdd) !== 0;
    });
    // console.log(foundChange);
    return foundChange ? true : false;
  }, [farmStorageDataToSent]);

  useEffect(() => {
    axiosApiInstance.get("/admin/hub?type=STORE").then((res) => {
      // console.log(res);
      // console.log(res.data.data);
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
        .filter((el) => el.amountToAdd !== "0");
      // console.log(data);
      axiosApiInstance
        .post(`/admin/traceability/${reqCode}/store/${values.hub}`, data)
        .then((response) => {
          setSubmitting(false);
          toast.success("تم الارسال بنجاح");
          // resetForm();
          getData();
        })
        .catch((e) => {
          toast.error("Error");
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
              <div className={styles.reqCodeCard}>{reqCode}</div>
              <i className="fas fa-long-arrow-alt-left fa-2x"></i>
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
                    ... اختار مركز التعبئة
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

function Step2({ reqCode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorExists, setErrorExists] = useState(false);

  const initialState = useMemo(() => {
    return {
      pageSize: 10,
      pageIndex: 0,
    };
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "المساحة الكلية (بالفدان)",
        accessor: "area",
      },
      {
        Header: "الصنف",
        accessor: "variety",
      },
      {
        Header: "الكمية المتاحة (بالطن)",
        accessor: "currentAmount",
        // Cell: EditableCell,
      },
      {
        Header: "الكمية المطلوبة (بالطن)",
        accessor: "amountToAdd",
        disableFilters: true,
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
          // console.log(row);
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

  function getData() {
    if (reqCode) {
      axiosApiInstance
        .get(`/admin/traceability/${reqCode}/charge`)
        .then((response) => {
          // console.log(response);
          setLoading(false);
          setData(() => {
            return response.data.data.map((el) => {
              return {
                ...el,
                amountToAdd: "0",
              };
            });
          });
        })
        .catch((e) => {
          toast.error("حدث خطأ");
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
  return (
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
                padding: "0.9em",
                cursor: "auto",
              }}
              className={styles.filterReportBtn}
              type="button"
            >
              {`إجمالي عدد الاصناف ${data.length}`}
            </Button>
            <button
              className="btn btn-dark"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </button>

            <button
              className="btn btn-dark"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {">>"}
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
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell, itr) => {
                        if (itr === 1) {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.value.replace("_", " ")}
                              {/* {cell.render("Cell")} */}
                            </td>
                          );
                        } else {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
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
            <SubmitForm
              farmStorageDataToSent={data}
              reqCode={reqCode}
              getData={getData}
              errorExists={errorExists}
            />
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
  );
}

export default Step2;
