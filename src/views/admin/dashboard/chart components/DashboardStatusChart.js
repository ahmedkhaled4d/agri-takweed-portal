import axios from 'services/axios.inercept';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, CardTitle, Col, Input } from 'reactstrap';
import { setStorage } from 'utils/storage/storage';
import { getStorage } from 'utils/storage/storage';
import dropDownStyle from './dropDown.module.css';

let currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];
export default function DashboardStatusChart() {
  const [reqByAllCrops, setReqByAllCrops] = useState({
    labels: [],
    counts: [],
    colors: [],
  });
  const [reqYear, setReqYear] = useState(currentYear);
  const dashboardRequestsStatisticsChart = {
    data: (canvas) => {
      return {
        labels: reqByAllCrops.labels,
        datasets: [
          {
            label: '# of Votes',
            pointRadius: 10,
            pointHoverRadius: 10,
            backgroundColor: reqByAllCrops.colors,
            borderWidth: 2,
            data: reqByAllCrops.counts,
          },
        ],
      };
    },
    options: {
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      maintainAspectRatio: false,
      pieceLabel: {
        render: 'percentage',
        fontColor: ['white'],
        precision: 10,
      },
    },
  };

  function getPieData() {
    const data = getStorage(`MahaseelPerYear-${reqYear}`);
    if (data) {
      setReqByAllCrops(JSON.parse(data));
    } else {
      axios
        .get(`/admin/dashboard/charts?season=${reqYear}`)
        .then((response) => {
          const obj = { labels: [], counts: [], colors: [] };

          response?.data?.forEach((item) => {
            obj.labels.push(item._id.name_ar);
            obj.counts.push(item.count);
            obj.colors.push(item._id.color);
          });
          setStorage(`MahaseelPerYear-${reqYear}`, JSON.stringify(obj));
          setReqByAllCrops(obj);
        })
        .catch((e) => console.error(e));
    }
  }

  useEffect(() => {
    getPieData();
  }, [reqYear]);
  return (
    <>
      <Col md="4">
        <Card>
          <CardHeader>
            <CardTitle className="row">
              <h5 className="mr-3">إحصائيات التكويد</h5>
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
              تمثيل بياني للمحاصيل المكودة خلال موسم {reqYear}
            </p>
          </CardHeader>
          <CardBody style={{ height: '21em' }}>
            <Pie
              data={dashboardRequestsStatisticsChart.data}
              options={dashboardRequestsStatisticsChart.options}
            />
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
