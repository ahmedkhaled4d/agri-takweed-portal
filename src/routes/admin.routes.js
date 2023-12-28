import Dashboard from 'views/admin/dashboard/Index';
import UsersList from 'views/admin/users/Index';
import RequestsList from 'views/admin/Requests/Index';
import InitialRequestsList from 'views/admin/InitialRequests/Index';
import CropsList from 'views/admin/crops/Index';
import LocationsList from 'views/admin/locations/Index';
import SendForm from 'views/admin/notifications/SendForm';
import postsList from 'views/admin/post/Index';
import TopicsList from 'views/admin/topic/Index';
// import Reports from 'views/admin/reports/index';
import CombinedMap from 'views/admin/combinedMap';
import TablesMap from 'views/admin/tablesMap';
import PointsMap from 'views/admin/pointsMap';
import Stores from 'views/admin/Stores/Index';
import StoresDistributers from 'views/admin/StoresDistributers/Index';
import DocumentsList from 'views/admin/Documents/Index';
import Committees from 'views/admin/committees/List';
import CommitteeStatistics from 'views/admin/committeeStatistics/index';
import Logs from 'views/admin/logs/List';
import ReportsTables from 'views/admin/reportsTables';
// import Mapbox from 'views/admin/mapbox/index';
// import EsriMain from 'views/admin/maps';
// import UserPage from "views/User.js";
import UploadGPX from "views/admin/uploadGPX/Index"

var routes = [
  {
    path: '/dashboard',
    name: 'لوحة المعلومات',
    icon: 'nc-icon nc-bank',
    component: Dashboard,
    layout: '/admin',
  },
  {
    path: '/requests',
    name: 'طلبات التكويد',
    icon: 'nc-icon nc-tile-56',
    component: RequestsList,
    layout: '/admin',
  },
  {
    path: '/uploadGPX',
    name: 'تعديل GPX',
    icon: 'fas fa-map-marked-alt',
    component: UploadGPX,
    layout: '/admin',
  },
  {
    path: '/tablesMap',
    name: 'تنسيق الجداول',
    icon: 'fas fa-map',
    component: TablesMap,
    layout: '/admin',
  },
  {
    path: '/combinedMap',
    name: 'الخريطة المجمعة',
    icon: 'fas fa-map',
    component: CombinedMap,
    layout: '/admin',
  },
  {
    path: '/pointsMap',
    name: 'خريطة النقاط',
    icon: 'fas fa-map',
    component: PointsMap,
    layout: '/admin',
  },
  {
    path: '/crops',
    name: 'المحاصيل الزراعية ',
    icon: 'fas fa-seedling',
    component: CropsList,
    layout: '/admin',
  },
  {
    path: '/locations',
    name: ' المناطق',
    icon: 'nc-icon nc-pin-3',
    component: LocationsList,
    layout: '/admin',
  },
  {
    path: '/reports',
    name: 'التقارير',
    icon: 'nc-icon nc-single-copy-04',
    component: ReportsTables,
    layout: '/admin',
  },
  {
    path: '/users',
    name: ' المستخدمين',
    icon: 'nc-icon nc-single-02',
    component: UsersList,
    layout: '/admin',
  },
  {
    path: '/stores',
    name: 'مراكز التخزين',
    icon: 'fa fa-store',
    component: Stores,
    layout: '/admin',
  },
  {
    path: '/distributersStores',
    name: 'المراكز',
    icon: 'nc-icon nc-tile-56',
    component: StoresDistributers,
    layout: '/admin',
  },
  {
    path: '/committees',
    name: 'اللجان',
    icon: 'fas fa-user-tie',
    component: Committees,
    layout: '/admin',
  },
  {
    path: '/committeeStatistics',
    name: 'إحصائيات اللجان',
    icon: 'far fa-chart-bar',
    component: CommitteeStatistics,
    layout: '/admin',
  },
  {
    path: '/post',
    name: 'الاخبار',
    icon: 'nc-icon nc-paper',
    component: postsList,
    layout: '/admin',
  },
  {
    path: '/topic',
    name: 'الفئات',
    icon: 'fa fa-list-alt',
    component: TopicsList,
    layout: '/admin',
  },
  {
    path: '/logs',
    name: 'السجلات',
    icon: 'fas fa-clipboard-list',
    component: Logs,
    layout: '/admin',
  },
  // {
  //   path: '/initialRequests',
  //   name: 'طلبات التقديم',
  //   icon: 'nc-icon nc-tile-56',
  //   component: InitialRequestsList,
  //   layout: '/admin',
  // },


  // {
  //   path: '/documents',
  //   name: 'المستندات',
  //   icon: 'far fa-file',
  //   component: DocumentsList,
  //   layout: '/admin',
  // },

  // {
  //   path: '/combinedMap',
  //   name: 'الخريطة المجمعة',
  //   icon: 'fas fa-map',
  //   component: CombinedMap,
  //   layout: '/admin',
  // },
  // {
  //   path: "/reports",
  //   name: "التقارير",
  //   icon: "nc-icon nc-single-copy-04",
  //   component: Reports,
  //   layout: "/admin",
  // },


  // {
  //   path: '/send',
  //   name: 'إرسال رسالة تنبية',
  //   icon: 'nc-icon nc-bell-55',
  //   component: SendForm,
  //   layout: '/admin',
  // },

  // {
  //   path: "/mapbox",
  //   name: "mapbox",
  //   icon: "fas fa-clipboard-list",
  //   component: Mapbox,
  //   layout: "/admin",
  // },
  
];
export default routes;
