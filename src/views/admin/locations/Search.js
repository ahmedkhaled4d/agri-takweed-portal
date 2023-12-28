import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Input,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import axios from 'services/axios.inercept';
import { useHistory } from 'react-router-dom';

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('hamlet');
  // const [endpoint, setEndpoint] = useState(
  //   `/admin/location/searchhamlet?hamlet=${searchInput}`
  // );
  const history=useHistory()

  function view(id,govId,govName,centerName) {
    if (searchType === 'center') {
      return {
        pathname: `/admin/locations/hamlet/${id}`,
        state: {
          governorateName: govName,
          governorateId: govId,
          centerName: centerName,
        },
      };
    }
}

  function handleSearch(e) {
    e.preventDefault();

    let finalEndPoint = `/admin/location/search${searchType}?name_ar=${searchInput}`;
    // console.log(finalEndPoint);
    if (!searchInput) {
      throw new Error();
    }
    setLoading(true);
    axios
      .get(finalEndPoint)
      .then((data) => {
        // console.log(data);
        setSearchResults(data.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">بحث</CardTitle>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  {/* radioBtn */}
                  <div
                    onChange={(e) => {
                      console.log(e.target.value);
                      setSearchType(e.target.value);
                      // setEndpoint(
                      //   `/admin/location/searchcenter?center=${searchInput}`
                      // );
                    }}
                  >
                    <input
                      type="radio"
                      value="hamlet"
                      name="hamlet"
                      checked={searchType === 'hamlet'}
                    />
                    وحدة محلية
                    <input
                      type="radio"
                      value="center"
                      name="center"
                      checked={searchType === 'center'}
                      style={{
                        marginRight: '0.8em',
                      }}
                    />
                    مركز
                  </div>

                  <Form
                    onSubmit={handleSearch}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '50%',
                    }}
                  >
                    <Input
                      name="search"
                      type="text"
                      className="locationsSearchDataInput"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                      }}
                    />
                    <Button color="info" className="float-right" type="submit">
                      {'بحث'} <i className="nc-icon nc-zoom-split" />
                    </Button>
                  </Form>
                </div>
              </CardHeader>
              <CardBody>
                {loading === true ? (
                  <div
                    style={{
                      minHeight: '80vh',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Spinner
                      animation="border"
                      role="status"
                      style={{ padding: '2.5rem' }}
                    ></Spinner>
                  </div>
                ) : (
                  <Table className="text-right" responsive>
                    <thead>
                      <tr>
                        <th>المحافظة</th>
                        <th>المركز</th>
                        <th>الوحدة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((el, i) => {
                        return (
                          <Link
                            key={i}
                            className="linkStyle"
                            style={searchType === 'hamlet'?{pointerEvents: 'none'}:{}}
                            to={view(el._id,el.govId,el.governorate,el.center)}
                          >
                            <tr key={i}>
                              <td>{el.governorate}</td>
                              <td>{el.center}</td>
                              <td>{el.hamlet}</td>
                            </tr>
                          </Link>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Search;
