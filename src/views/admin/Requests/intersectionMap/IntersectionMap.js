import React, { useRef, useState } from 'react';
import styles from './IntersectionMap.module.css';
import { options } from './mapOptions';
import { GoogleMap } from '@react-google-maps/api';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import FarmPolygons from './FarmPolygons/FarmPolygons';
import IntersectionPolygons from './IntersectionPolygons/IntersectionPolygons';
import MapTable from './MapTable/MapTable';

const IntersectionMap = ({ Request }) => {
  // console.log(Request)
  const [clickedMarkerID, setClickedMarkerID] = useState(null);

  const landsArr = Request.intersections[0].lands;
  const intersectionsDataArr = Request.intersections[0].intersectionsData;

  const farmPolygonsWithPolygonsInstances = useRef([]);
  const intersectionPolygonsWithPolygonsInstances = useRef([]);

  //to display in the static table
  const farmsNames = () => {
    const farmNames = landsArr.map((land) => land.farm.name);
    farmNames.shift();
    return farmNames;
  };

  //to display in main table
  let intersectionsCount = 0;
  intersectionsDataArr.forEach((element) => {
    element.intersectionCoords.forEach(() => intersectionsCount++);
  });

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader className="d-flex justify-content-between">
                <div>
                  <p>تقاطعات المزرعة مع المزارع الأخرى</p>
                  <span className={styles.farmColorLegend1}>
                    ▇ المزرعة الأصلية
                  </span>
                  <span className={styles.farmColorLegend2}>
                    ▇ المزارع الاخرى
                  </span>
                  <span className={styles.farmColorLegend3}>
                    ▇ منطقة التقاطع
                  </span>
                </div>
              </CardHeader>

              <CardBody>
                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '90vh',
                  }}
                  options={options}
                >
                  {/* STATIC TABLE OF INTERSECTION MAP */}
                  <MapTable
                    numOfFarmsIntersectingMine={
                      Request.intersections[0].lands.length - 1
                    }
                    numOfIntersections={intersectionsCount}
                    FarmsIntersectingMine={farmsNames().join(' --- ')}
                  />

                  {/* LANDS POLYGINS */}
                  <FarmPolygons
                    request={Request}
                    landsArr={landsArr}
                    farmPolygonsWithPolygonsInstances={
                      farmPolygonsWithPolygonsInstances
                    }
                    clickedMarkerID={clickedMarkerID}
                    setClickedMarkerID={setClickedMarkerID}
                  />

                  {/* INTERSECTOINED PART POLYGINS */}
                  <IntersectionPolygons
                    request={Request}
                    intersectionsDataArr={intersectionsDataArr}
                    intersectionPolygonsWithPolygonsInstances={
                      intersectionPolygonsWithPolygonsInstances
                    }
                    clickedMarkerID={clickedMarkerID}
                    setClickedMarkerID={setClickedMarkerID}
                  />
                </GoogleMap>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default IntersectionMap;
