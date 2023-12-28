
import {  Row, } from 'reactstrap';
import useExternalScript from '../../../utils/customHooks/useExternalScript';

import Map from './map/Map';
import DashboardStatusChart from './chart components/DashboardStatusChart';
import StatusChart from './chart components/StatusChart';
import CropsChart from './chart components/CropsChart';
import ViewsChart from './chart components/ViewsChart';
import  HeatMap  from './map/HeatMap';



const reqByStatusLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];


//   خوخ: '#FFE5B4',
//   موالح: '#f9ca24',
//   فراولة: '#EA2027',
//   جوافة: '#EA2027',
//   طماطم: '#d63031',
//   برقوق: '#8b668b',
//   مشمش: '#fdcb6e',
//   مانجا: '#f39c12',
//   بصل: '#95a5a6',
//   فلفل: '#009432',
//   عنب: '#6F1E51',
//   رمان: '#eb4d4b',
//   بطاطس: '#ffeaa7',
// };
const markerClusterScript =
  'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';

function Charts() {
  const markerClusterState = useExternalScript(
    markerClusterScript,
    'markerClusterer'
  );
 

  return (
    <>
      <Row>
        <DashboardStatusChart />
        <HeatMap />

        {/* {!markerClusterState && <p>Loading...</p>}
        {markerClusterState && <Map center={{ lat: 26.8025, long: 30.8206 }} />} */}


        <StatusChart reqByStatusLabels={reqByStatusLabels} />
        <CropsChart reqByStatusLabels={reqByStatusLabels} />
        <ViewsChart />
      </Row>

    </>
  );
}

export default Charts;
