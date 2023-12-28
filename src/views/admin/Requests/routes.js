import View from './view';
import List from './List';
import AddRequestPage from './AddRequestComp/AddRequestPage';

// import Charges from './Charges';
// import TraceGraph from "./requestHistory/TraceGraph/TraceGraph";

var routes = [
  {
    path: '/',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: List,
    layout: '/admin/requests',
  },
  {
    path: '/view/:id',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: View,
    layout: '/admin/requests',
  },
  // {
  //   path: '/AddRequest',
  //   name: 'لوحه المعلومات',
  //   icon: 'nc-icon nc-bank',
  //   component: AddRequst,
  //   layout: '/admin/requests',
  // },
  {
    path: '/addRequest',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: AddRequestPage,
    layout: '/admin/requests',
  },
  // {
  //   path: '/Charges',
  //   name: 'لوحه المعلومات',
  //   icon: 'nc-icon nc-bank',
  //   component: Charges,
  //   layout: '/admin/requests',
  // },
  // {
  //   path: "/TraceGraph",
  //   name: "لوحه المعلومات",
  //   icon: "nc-icon nc-bank",
  //   component: TraceGraph,
  //   layout: "/admin/requests",
  // },
];
export default routes;
