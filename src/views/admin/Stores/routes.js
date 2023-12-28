import View from './view';
import List from './List';
import AddFormStores from './AddForm';
// import HealthCertificateModal from './healthCertificate/index'

var routes = [
  {
    path: '/',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: List,
    layout: '/admin/stores',
  },
  {
    path: '/view/:id',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: View,
    layout: '/admin/stores',
  },
  {
    path: '/addForm',
    name: 'لوحه المعلومات',
    icon: 'nc-icon nc-bank',
    component: AddFormStores,
    layout: '/admin/stores',
  },
];
export default routes;
