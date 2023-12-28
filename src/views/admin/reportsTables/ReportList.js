import React, { useMemo } from 'react';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Row,
  Col,
  Input,
  CardFooter,
} from 'reactstrap';
import styles from './reportsTables.module.css';
import DefaultColumnFilter from './DefaultFilter';

function ReportList({ columns, data, execlFn, filterValues, crops }) {

  const initialState = useMemo(() => {
    return {
      pageSize: 10,
      pageIndex: 0,
    };
  }, []);
  
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

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
            <CardHeader></CardHeader>
            <CardBody>
              <Button
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
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(page);
                  }}
                />
              </Button>

              <Button
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
              </Button>
              {/* <Button
                color="dark"
                style={{
                  // width: '5rem',
                  padding: '0.9em',
                }}
                className={styles.filterReportBtn}
                type="button"
                onClick={() => {
                  execlFn(data, filterValues, crops);
                }}
              >
                تحميل ملف إكسل
              </Button> */}
              <Button
                color="success"
                style={{
                  // width: '5rem',
                  padding: '0.9em',
                  cursor: 'auto',
                  color: '#000',
                }}
                className={styles.filterReportBtn}
                type="button"
                onClick={() => {
                  execlFn(data, filterValues, crops);
                }}
              >
                تحميل ملف إكسل
              </Button>
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
                {`إجمالي عدد الطلبات ${data.length}`}
              </Button>
              <Table
                responsive
                {...getTableProps()}
                className={`${styles.reportsTablesTd} text-right`}
              >
                <thead className="bg-success">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{ backgroundColor: 'rgba(153, 153, 153,0.2)' }}
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
                        {row.cells.map((cell) => {
                          if (Array.isArray(cell.value)) {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.value.map((el, index) => {
                                  return <div key={index}>{el}</div>;
                                })}
                              </td>
                            );
                          } else if (
                            typeof cell.value === 'object' &&
                            cell.value !== null
                          ) {
                            return (
                              <td>
                                {Object.entries(cell.value).map(
                                  ([key, value], index) => {
                                    return (
                                      <div key={index}>
                                        {key} : {value}
                                      </div>
                                    );
                                  }
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
              <span>
                صفحة{' '}
                <strong>
                  {pageIndex + 1} من {pageOptions.length}
                </strong>
              </span>
            </CardFooter>
          </Card>
        </Col>
        {/* 
         Pagination can be built however you'd like. 
         This is just a very basic UI implementation:
       */}
        <div className="pagination">
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
        </div>
      </Row>
    </>
  );
}

export default ReportList;
