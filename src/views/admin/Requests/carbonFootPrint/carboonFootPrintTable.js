import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Form,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import EditableCell from './EditableCell';
import { Formik } from 'formik';
import axiosApiInstance from 'services/axios.inercept';
import toast from 'react-hot-toast';

function SubmitForm({ dataToSent, reqCode, init }) {
  const handleSubmitForm = (values, { setSubmitting }) => {
    const reloadToast = toast.loading(`برجاء الانتظار حتى يتم التعديل`);

    let data = dataToSent?.map((el) => {
      return {
        name_ar: el.name_ar,
        variety: el.variety,
        points: el.points,
        carbonFootprint: el.carbonFootprint,
      };
    });
    axiosApiInstance
      .put(`/admin/request/gpx/${reqCode}`, { gpx: data })
      .then((response) => {
        setSubmitting(false);
        toast.dismiss(reloadToast);
        toast.success('تم التعديل بنجاح');
        init();
      })
      .catch((e) => {
        toast.dismiss(reloadToast);
        toast.error('حدث خطأ ...');
        console.error(e);
        setSubmitting(false);
      });
  };

  return (
    <>
      <Formik initialValues={{}} onSubmit={handleSubmitForm}>
        {({
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center">
              <Button
                className="default-button"
                type="submit"
                disabled={isSubmitting}
              >
                تعديل
              </Button>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}

function CarboonFootprintTable({ init, gpx, reqCode }) {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState({ isOpen: false, desc: '' });

  function toggleModal(desc) {
    setModalOpen((prev) => {
      if (prev.isOpen) {
        return { isOpen: false, desc: '' };
      } else {
        return { isOpen: true, desc: desc };
      }
    });
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
        Header: 'اسم القطعة',
        accessor: 'name_ar',
      },
      {
        Header: 'الصنف',
        accessor: 'variety',
      },
      {
        Header: 'المساحة',
        accessor: 'area',
      },
      {
        Header: 'البصمة الكربونية',
        accessor: 'carbonFootprint',
        Cell: EditableCell,
      },
      {
        Header: 'الشارة',
        accessor: 'carbonFootprintBadge',
      },
    ],
    []
  );

  function updateMyData(rowIndex, columnId, newValue) {
    // setSkipPageReset(true);
    setData((prev) =>
      prev.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...prev[rowIndex],
            [columnId]: newValue,
          };
        }
        return row;
      })
    );
  }

  useEffect(() => {
    if (gpx?.length > 0) {
      const newShape = gpx.map((one) => {
        return { ...one, carbonFootprintBadge: one.carbonFootprint };
      });
      setData(newShape);
    }
  }, [gpx]);

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
    nextPage,
    previousPage,
    defaultColumn,
  } = useTable(
    {
      columns,
      data,
      initialState,
      //our own data start
      updateMyData,
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
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Button
                color="dark"
                style={{
                  padding: '0.9em',
                  cursor: 'auto',
                  display: 'inline-block',
                }}
                type="button"
              >
                {`إجمالي عدد الاراضى ${data.length}`}
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
              <Table responsive {...getTableProps()} className={` text-right`}>
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
                          if (cell.column.id === 'carbonFootprintBadge') {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.value ? (
                                  <img
                                    width={100}
                                    src={`/assets/images/media/carbonFootPrint/${cell.value}.png`}
                                  />
                                ) : (
                                  'لا يوجد'
                                )}
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
              <SubmitForm
                dataToSent={data}
                reqCode={reqCode}
                init={init}
                initialData={gpx}
              />
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={modalOpen.isOpen}
        toggle={() => toggleModal('')}
        fade={false}
      >
        <ModalHeader toggle={() => toggleModal('')}>تفاصيل</ModalHeader>
        <ModalBody>
          <div>{modalOpen.desc}</div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default CarboonFootprintTable;
