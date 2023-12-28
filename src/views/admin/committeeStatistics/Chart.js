import React from 'react';
import { Bar } from 'react-chartjs-2';
import { setStorage, getStorage } from 'utils/storage/storage';
import { useState } from 'react';
import axios from 'services/axios.inercept';
import { useEffect } from 'react';
import {
  CardBody,
  CardHeader,
  CardTitle,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from 'reactstrap';
import SearchForm from './SearchForm';
// let mydata = [];
// for (let i = 0; i < 300; i++) {
//   mydata.push({
//     _id: "622eff6753314e5d0077f8f0",
//     count: i + 10,
//     type: "hagr",
//     name: "محمد حسام",
//     phone: "+201117769594",
//   });
// }
export default function Chart({ activeTab }) {
  const [committeStat, setCommitteStat] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  // const [currentQuery, setCurrentQuery] = useState("")
  const [loading, setLoading] = useState(false);

  const toggle = () => setModalOpen(!modalOpen);

  function getCommitteStat(query = '') {
    // const data = getStorage(`CommitteStatistics`);
    // if (data) {
    //   setCommitteStat(JSON.parse(data));
    // } else {
    // console.log(query);
    setLoading(true);
    axios
      .get(`${activeTab.endPoint}${query}`)
      .then((response) => {
        // console.log(response.data);
        let sortedData = response.data.data.sort((a, b) => b.count - a.count);
        // setStorage(`CommitteStatistics`, JSON.stringify(sortedData));
        // console.log(response.data.data.sort((a, b) => b.count - a.count));
        setCommitteStat(sortedData);
        setLoading(false);
      })
      .catch((e) => console.error(e));
    // }
  }
  const handleSearch = (values) => {
    let query = '?';
    if (values.fromDate.length > 0) {
      query = query + `fromDate=${values.fromDate}&`;
    }
    if (values.toDate.length > 0) {
      query = query + `toDate=${values.toDate}&`;
    }
    //  setCurrentQuery(query);
    setLoading(false);
    getCommitteStat(query);
    toggle();
  };

  const committeeStatChart = {
    data: (canvas) => {
      return {
        labels: committeStat.map((el) => el[activeTab.y]),
        datasets: [
          {
            // lable: 'test',
            data: committeStat.map((el) => el[activeTab.x]),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
            ],
            borderWidth: 1,
            barThickness: '20',
          },
        ],
      };
    },

    options: {
      indexAxis: 'y',
      interaction: {
        mode: 'y',
      },
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            beforeLabel: (tooltipItems) => {
              if (activeTab?.itemsToView[0] !== {}) {
                if (isNaN(activeTab.itemsToView[0].key)) {
                  return `${activeTab.itemsToView[0].name} : ${
                    committeStat[tooltipItems.dataIndex][
                      activeTab.itemsToView[0].key
                    ]
                  }`;
                } else {
                  return `${activeTab.itemsToView[0].name} : ${committeStat[
                    tooltipItems.dataIndex
                  ][activeTab.itemsToView[0].key].substring(2, 13)}`;
                }
              }
              return '';
            },
            label: (tooltipItems) => {
              if (activeTab?.itemsToView[1]) {
                return `${activeTab.itemsToView[1].name} : ${
                  committeStat[tooltipItems.dataIndex][
                    activeTab.itemsToView[1].key
                  ]
                }`;
              }
              return '';
            },
            afterLabel: (tooltipItems) => {
              if (activeTab?.itemsToView[2]) {
                return `${activeTab.itemsToView[2].name} : ${
                  committeStat[tooltipItems.dataIndex][
                    activeTab.itemsToView[2].key
                  ]
                }`;
              }
              return '';
            },
          },
          intersect: false,
          rtl: true,
          padding: 10,
          displayColors: false,
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'عدد المزارع',
            padding: 30,
            font: {
              size: 15,
            },
            color: 'black',
          },
        },
      },
    },
  };

  useEffect(() => {
    getCommitteStat();
  }, [activeTab]);

  return (
    <>
      <div className="content">
        {loading && <Spinner animation="border" role="status"></Spinner>}
        <Card className="card-chart">
          <CardHeader>
            <CardTitle className="row align-items-baseline">
              <h5 className="mr-3 ">بياني توزيع اللجان</h5>
              <Button color="dark" className=" mr-5" onClick={toggle}>
                <i className="nc-icon nc-zoom-split" /> - بحث
              </Button>
              <Button
                onClick={() => {
                  getCommitteStat('');
                }}
                color="info"
                className="mr-1"
              >
                <i className="nc-icon nc-refresh-69" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardBody
            style={{
              height: `${
                7 * (committeStat.length === 0 ? 4 : committeStat.length)
              }em`,
              width: '100%',
            }}
          >
            {/* {committeStat.length !== 0 ? ( */}
            <Bar
              data={committeeStatChart.data}
              options={committeeStatChart.options}
            />
          </CardBody>
        </Card>
      </div>
      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث اللجان</ModalHeader>
        <ModalBody>
          <SearchForm handleSearch={handleSearch} />
        </ModalBody>
      </Modal>
    </>
  );
}
