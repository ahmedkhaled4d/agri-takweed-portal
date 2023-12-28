import axios from 'services/axios.inercept';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, CardTitle, Col, Input } from 'reactstrap';
import { setStorage, getStorage } from 'utils/storage/storage';
import dropDownStyle from './dropDown.module.css';
let currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];
export default function StatusChart({ reqByStatusLabels }) {
  const [reqByStatus, setReqByStatus] = useState([]);
  const [reqYear, setReqYear] = useState(currentYear);

  const reqByStatusColors = {
    reject: 'red',
    accept: 'green',
    inprogress: '#fbc658',
  };
  const reqByStatusChart = {
    data: (canvas) => {
      return {
        labels: reqByStatusLabels,
        datasets: reqByStatus.map((el, i) => {
          return {
            label: el._id.statusArr,
            data: el.arr.map((el) => {
              return { x: reqByStatusLabels[el.x - 1], y: el.y };
            }),
            // stack: `stack ${i}`,
            // grouped: true,
            backgroundColor: reqByStatusColors[el._id.statusArr],
            barPercentage: 0.5,
            barThickness: 15,
            maxBarThickness: 15,
            minBarLength: 2,
            xAxisID: 'x',
            yAxisID: 'y',
          };
        }),
      };
    },

    options: {
      interaction: {
        mode: 'x',
      },
      // scales: {
      //   x: {
      //     stacked: true,
      //   },
      //   y: {
      //     stacked: true,
      //   },
      // },
      plugins: {
        legend: {
          display: true,
          // display: false,
          // position: 'left',
          // align: 'chartArea',
        },
      },
      responsive: true,
    },
  };
  function handleChange(e) {
    // if (e.target.options[e.target.selectedIndex].value === 'default') {
    //   setReqYear('2022');
    //   return;
    // }
    setReqYear(e.target.value);
  }

  function getReqByStatus() {
    const data = getStorage(`MahaseelStatus-${reqYear}`);
    if (data) {
      setReqByStatus(JSON.parse(data));
    } else {
      axios
        .get(`/admin/dashboard/requestsbystatus?season=${reqYear}`)
        .then((response) => {
          setStorage(
            `MahaseelStatus-${reqYear}`,
            JSON.stringify(response.data)
          );
          setReqByStatus(response.data);
        })
        .catch((e) => console.error(e));
    }
  }

  useEffect(() => {
    getReqByStatus();
  }, [reqYear]);
  return (
    <>
      <Col md="12">
        <Card className="card-chart">
          <CardHeader>
            <CardTitle className="row">
              <h5 className="mr-3">بياني تكويد المحاصيل</h5>
              <Input
                id="years"
                name="years"
                type="select"
                className={`mr-5 ${dropDownStyle.dropDown}`}
                onChange={(e) => setReqYear(e.target.value)}
                // defaultValue="default"
              >
                {/* <option disabled value="default">
                  اختر السنة ..
                </option> */}
                {years.map((year, i) => {
                  return (
                    <option key={i} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Input>
            </CardTitle>

            <p className="card-category">
              خاص بعرض حالة الطلبات لسنة {reqYear}
            </p>
          </CardHeader>
          <CardBody>
            <Bar
              data={reqByStatusChart.data}
              options={reqByStatusChart.options}
              width={500}
              height={100}
            />
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
