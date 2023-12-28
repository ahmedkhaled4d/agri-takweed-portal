/*!

*/
import CenterList from './CenterList';
import HamletList from './HamletList';
import GovernoratesList from './GovernoratesList';
import Search from './Search';

var routes = [
  {
    path: '/',
    name: 'بيانات الموقع',
    component: GovernoratesList,
    layout: '/admin/locations',
  },

  {
    path: '/center/:id',
    name: 'بيانات الموقع',
    component: CenterList,
    layout: '/admin/locations',
  },

  {
    path: '/hamlet/:id',
    name: 'بيانات الموقع',
    component: HamletList,
    layout: '/admin/locations',
  },
  {
    path: '/search',
    name: 'بحث',
    component: Search,
    layout: '/admin/locations',
  },
];
export default routes;
