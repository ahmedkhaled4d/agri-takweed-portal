/*!

*/
import List from './list/List';
import Add from './add/Add';

var routes = [
  {
    path: '/',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: List,
    layout: '/admin/post',
  },

  {
    path: '/add',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: Add,
    layout: '/admin/post',
  },
];
export default routes;
