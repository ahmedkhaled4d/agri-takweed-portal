import List from './List';
import UploadedPics from './uploadedPics';

var routes = [
  {
    path: '/',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: List,
    layout: '/admin/documents',
  },
  {
    path: '/uploadedPics',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: UploadedPics,
    layout: '/admin/documents',
  },
];
export default routes;
