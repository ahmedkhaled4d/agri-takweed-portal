import axios from 'services/axios.inercept';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'reactstrap';
import { setStorage, getStorage } from 'utils/storage/storage';

export default function ViewsChart() {
  const [reqByviews, setReqByViews] = useState({});

  const reqByViewsChart = {
    data: (canvas) => {
      return {
        labels: reqByviews.name,
        datasets: [
          {
            label: 'المشاهدات',
            data: reqByviews.views,
            borderColor: 'green',
            backgroundColor: 'green',
            barPercentage: 0.5,
            barThickness: 50,
            maxBarThickness: 50,
            minBarLength: 2,
          },
        ],
      };
    },
    options: {
      options: {
        plugins: {
          legend: { display: true },
        },
        responsive: true,
      },
    },
  };

  function getReqByViews() {
    const data = getStorage('postsViews');
    if (data) {
      setReqByViews(JSON.parse(data));
    } else {
      axios
        .get('/admin/dashboard/postsviews')
        .then((response) => {
          const data = response.data.reduce(
            (prev, curr) => {
              prev.name.push(curr._id.name);
              prev.views.push(curr.No_of_Views);
              return prev;
            },
            { name: [], views: [] }
          );
          setStorage('postsViews', JSON.stringify(data));
          setReqByViews(data);
        })
        .catch((e) => console.error(e));
    }
  }
  useEffect(() => {
    getReqByViews();
  }, []);
  return (
    <>
      <Col md="12">
        <Card className="card-chart">
          <CardHeader>
            <CardTitle tag="h5">بياني عدد المشاهدات </CardTitle>
            <p className="card-category"> بياني خاص بعرض عدد مشاهدات الاخبار</p>
          </CardHeader>
          <CardBody>
            <Bar
              data={reqByViewsChart.data}
              options={reqByViewsChart.options}
              width={400}
              height={100}
            />
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
