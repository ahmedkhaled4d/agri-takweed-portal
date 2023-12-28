/*!

*/
import View from './view';
import List from './List';
import Edit from './Edit';
import UploadedPics from './uploadedPics';

var routes = [
  {
    path: '/',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: List,
    layout: '/admin/initialRequests',
  },
  {
    path: '/view/:id',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: View,
    layout: '/admin/initialRequests',
  },
  {
    path: '/edit/:id',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: Edit,
    layout: '/admin/initialRequests',
  },
  {
    path: '/uploadedPics',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: UploadedPics,
    layout: '/admin/initialRequests',
  },
];
export default routes;
