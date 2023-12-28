import axios from 'services/axios.inercept';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, CardTitle, Col, Input } from 'reactstrap';
import { setStorage, getStorage } from 'utils/storage/storage';
import dropDownStyle from './dropDown.module.css';

let currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];
export default function CropsChart({ reqByStatusLabels }) {
  const [reqBycrops, setReqBycrops] = useState([]);
  const [reqYear, setReqYear] = useState(currentYear);
  const reqByCropsChart = {
    data: (canvas) => {
      return {
        labels: reqByStatusLabels,
        datasets: reqBycrops.map((el) => {
          return {
            label: el._id.name,
            data: el.arr.map((el) => {
              return { x: reqByStatusLabels[el.x - 1], y: el.y };
            }),
            borderColor: el._id.color,
            backgroundColor: el._id.color,
            barPercentage: 0.5,
            barThickness: 8,
            maxBarThickness: 8,
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
      plugins: {
        legend: {
          display: true,
        },
      },
      responsive: true,
    },
  };
  function getReqByCrops() {
    const data = getStorage(`MahaseelPerMonth-${reqYear}`);
    if (data) {
      setReqBycrops(JSON.parse(data));
    } else {
      axios
        .get(`/admin/dashboard/requestsbycrops?season=${reqYear}`)
        .then((response) => {
          setStorage(
            `MahaseelPerMonth-${reqYear}`,
            JSON.stringify(response.data)
          );
          setReqBycrops(response.data);
        })
        .catch((e) => console.error(e));
    }
  }


  useEffect(() => {
    getReqByCrops();
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
                // defaultValue="2023"
              >
                {/* <option disabled value="default">اختر السنة ..</option> */}

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
              خاص بعرض نسبة تكويد المحاصيل لسنة {reqYear}
            </p>
          </CardHeader>
          <CardBody>
            <Bar
              data={reqByCropsChart.data}
              options={reqByCropsChart.options}
              width={400}
              height={100}
            />
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
