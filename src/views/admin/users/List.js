import React, { useEffect, useState } from "react";
import { fetchData } from "services/api.service";
import { useHistory } from "react-router-dom";
import Convert from "utils/convert/convert";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Spinner,
} from "reactstrap";
import SearchUserForm from "./SearchUserForm";
import ToggleButton from "./toggleButton/ToggleButton";
import toast, { Toaster } from "react-hot-toast";
import AddUserForm from "./AddUserForm";
import EditStatus from "./EditStatus";
import axios from "services/axios.inercept";

function Tables() {
  const [modalOpen, setModalOpen] = useState(false);
  const [addUsermodalOpen, setAddUserModalOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggle = () => setModalOpen(!modalOpen);
  const toggleAddUserModal = () => setAddUserModalOpen(!addUsermodalOpen);

  const [users, setUsers] = useState([]);
  var [page, setPage] = useState(0);
  // var [downloadExcelLink, setDownloadExcelLink] = useState('');
  let history = useHistory();

  function exportToCSV(filename) {
    // console.log(users);
    let usedUsers = [
      {
        _id: "id",
        name: "الاسم",
        email: "البريد الإليكتروني",
        phone: "رقم التليفون",
        otpVerified: "حالة التاكيد",
        nationalId: "رقم الهويه	",
        createdAt: "تاريخ التسجيل",
      },
      ...users,
    ];
    // let usedUsers = users;
    let csvContent = new Convert().toCSV(usedUsers);

    let URL =
      "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csvContent);

    // arr = [{ bnd: "Brand name", prd: "product name", skus: "count of skus" }, ...arr]

    // const dataFileType = 'application/vnd.ms-excel';
    // const dataFileType =
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
    // const dataFileType =
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // const dataFileType =
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8';

    // const dataFileType =
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // const tableSelect = document.getElementById(tableID);
    // console.log(tableRef.current);
    // let tableHTMLData = tableRef.current.outerHTML;
    // console.log(tableHTMLData);
    // let tableHTMLData = tableRef.current;
    // let tableHTMLData = encodeURIComponent(tableRef.current.outerHTML);
    // let tableHTMLData = tableRef.current.outerHTML;
    let fileName = `${filename}.csv`;
    // Create download link element
    let downloadLink = document.createElement("a");

    if (downloadLink.download !== undefined) {
      // feature detection
      downloadLink.href = URL;
      downloadLink.setAttribute("download", fileName);
      downloadLink.click();
    } else {
      window.open(URL);
    }
    // document.body.appendChild(downloadLink);
    // function s2ab(s) {
    //   var buf = new ArrayBuffer(s.length);
    //   var view = new Uint8Array(buf);
    //   for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    //   return buf;
    // }
    // if (navigator.msSaveOrOpenBlob) {
    // const blob = new Blob([s2ab(tableHTMLData)], {
    //   type: dataFileType,
    // });
    // const blob = new Blob([tableHTMLData], {
    //   type: dataFileType,
    // });
    // const blob = new Blob(['\ufeff', tableHTMLData], {
    //   type: dataFileType,
    // });
    //   navigator.msSaveOrOpenBlob(blob, fileName);
    // } else {
    // Create a link to the file
    // downloadLink.href = 'data:' + dataFileType + ', ' + tableHTMLData;

    // downloadLink.href = 'data:' + dataFileType + ',' + x;

    // Setting the file name
    // downloadLink.download = filename;
    // const blob = new Blob(['\ufeff', tableHTMLData], {
    //   type: dataFileType,
    // });
    // const objectURL = URL.createObjectURL(blob);

    // console.log(downloadLink);
    // console.log(downloadLink.download);
    //triggering the function
    // downloadLink.click();
    // setDownloadExcelLink(downloadLink);
    // }
  }

  const handleCsvFileSelected = (e) => {
    const file = e.target.files[0];
    // if (file.type !== 'application/octet-stream') {
    //   return toast.error('يجب توفير ملف GPX');
    // }
    let data = new FormData();
    data.append("file", file, file.name);
    // const headers = {
    //   action: override === false ? 'append' : 'override',
    // };
    axios
      .post("/admin/media/upload/xlsx", data)
      .then((response) => {
        toast.success(`تم رفع الملف بنجاح / ${file.name}`);
        // init();
        // console.log(response.data.data.gpx);
        // console.log(response);
        // setPolygonPoints(response.data.data.gpx);
      })
      .catch((e) => console.error(e));
  };

  function load(page = 1, query = currentQuery) {
    setIsLoading(true);
    return fetchData("/user" + query, "get", null, {
      sortBy: "createdAt",
      sortValue: -1,
      page,
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        setPage(1);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    load(1).then(() => setPage(1));
  }, []);

  const handelSearch = (values) => {
    let query = "?";
    if (values.name.length > 0) {
      query = query + `name=${values.name}&`;
    }
    if (values.nationalId.length > 0) {
      query = query + `nationalId=${values.nationalId}&`;
    }
    if (values.phone.length > 0) {
      query = query + `phone=${values.phone}&`;
    }
    if (values.otpVerified.length > 0) {
      query = query + `otpVerified=${values.otpVerified}&`;
    }
    toggle();
    load(1, query);
    setCurrentQuery(query);
  };
  // const addUser = () => {
  //   load;

  //   return;
  // };

  const disablNext = () => {
    if (users.length === 0 || users.length < 10) return true;
  };
  const disablLast = () => {
    if (page <= 1) return true;
  };

  const next = () => {
    load(page + 1).then(() => setPage(page + 1));
  };

  const last = () => {
    load(page - 1).then(() => setPage(page - 1));
  };

  function viewItem(id, e) {
    // if (e.target.localName === 'button') return;
    history.push(`/admin/users/view/${id}`);
  }

  return (
    <>
      <Toaster />
      <div className="content">
        {isLoading === true && (
          <Spinner animation="border" role="status"></Spinner>
        )}
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <Button onClick={toggle} color="dark" className="float-right">
                  <i className="nc-icon nc-zoom-split" /> - بحث
                </Button>
                <Button
                  onClick={() => {
                    //reset
                    load(1, "");
                    setCurrentQuery("");
                  }}
                  color="info"
                  className="float-right"
                >
                  <i className="nc-icon nc-refresh-69" />
                </Button>
                <Button color="dark" className="float-right">
                  {page}
                </Button>
                <Button
                  color="dark"
                  className="float-right"
                  onClick={() => exportToCSV("المستخدمين")}
                >
                  تنزيل ملف csv
                </Button>
                <Button
                  color="dark"
                  className="float-right"
                  onClick={toggleAddUserModal}
                >
                  إضافة
                </Button>
                <Button
                  // className="file btn btn-md btn-primary"
                  color="dark"
                  // className="float-right"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  رفع ملف مهندسين
                  <input
                    onChange={handleCsvFileSelected}
                    type="file"
                    name="csv_file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      right: 0,
                      top: 0,
                      height: "100%",
                    }}
                  />
                </Button>
              </CardHeader>
              <CardBody>
                {/* <div className="table-responsive">
                  <table className="text-right table">
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>رقم التليفون</th>
                        <th>البريد الإليكتروني</th>
                        <th>رقم الهويه</th>
                        <th>تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={user._id}
                          style={{
                            cursor: 'pointer',
                            color: user.otpVerified ? '' : '#ff0000',
                          }}
                          onClick={() => viewItem(user._id)}
                          // className={
                          //   'text-' + (user.otpVerified ? 'default' : 'warning')
                          // }
                        >
                          <td>{user.name}</td>
                          <td>{user.phone.substring(2, 13)}</td>
                          <td>{user.email}</td>
                          <td>{user.nationalId}</td>
                          <td>{user.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}

                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>رقم التليفون</th>
                      <th>البريد الإليكتروني</th>
                      <th>الرقم القومي</th>
                      <th>تاريخ التسجيل</th>
                      <th>حالة الحساب</th>
                      {/* <th>حالة الشهادة</th> */}
                      <th>الصلاحيات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user._id}
                        style={{
                          cursor: "pointer",
                          color: user.otpVerified ? "" : "#ff0000",
                        }}
                        onClick={(e) => viewItem(user._id, e)}
                        // className={
                        //   'text-' + (user.otpVerified ? 'default' : 'warning')
                        // }
                      >
                        <td>{user.name}</td>
                        <td>{user.phone.substring(2, 13)}</td>

                        <td>{user.email}</td>
                        <td>{user.nationalId}</td>
                        <td>{user.createdAt.substring(0, 10)}</td>
                        <td>
                          <ToggleButton
                            active={user.otpVerified}
                            id={user._id}
                            type="user"
                            // setUpdateFlag={setUpdateFlag}
                            reload={() => load(1).then(() => setPage(1))}
                          />
                        </td>
                        {/* <td>
                          <ToggleButton
                            active={user.reviewer || null}
                            id={user._id}
                            type="cert"
                          />
                        </td> */}
                        <td>
                          <EditStatus
                            permissions={user.permissions}
                            id={user._id}
                            reload={() => load(1).then(() => setPage(1))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Button onClick={last} disabled={disablLast()} color="dark">
            السابق
          </Button>
          <Button onClick={next} disabled={disablNext()} color="dark">
            التالي
          </Button>
        </Row>
      </div>

      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث عن المستخدمين</ModalHeader>
        <ModalBody>
          <SearchUserForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>
      <Modal isOpen={addUsermodalOpen} toggle={toggleAddUserModal} fade={false}>
        <ModalHeader toggle={toggleAddUserModal}>إضافة مهندس</ModalHeader>
        <ModalBody>
          <AddUserForm load={load} setCurrentQuery={setCurrentQuery} />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Tables;
