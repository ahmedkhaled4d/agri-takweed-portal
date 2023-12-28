import List from "./List";
import AddStoreForm from "./Forms/AddStoreForm";
// import HealthCertificateModal from './healthCertificate/index'
import AddDistributerForm from "./Forms/AddDistributerForm";
import AddExporterForm from "./Forms/AddExporterForm";

var routes = [
  {
    path: "/",
    // name: "لوحه المعلومات",
    // icon: "nc-icon nc-bank",
    component: List,
    layout: "/admin/distributersStores",
  },
  {
    path: "/store/:id",
    // name: "لوحه المعلومات",
    // icon: "nc-icon nc-bank",
    component: AddStoreForm,
    layout: "/admin/distributersStores",
  },
  {
    path: "/distributer/:id",
    // name: "لوحه المعلومات",
    // icon: "nc-icon nc-bank",
    component: AddDistributerForm,
    layout: "/admin/distributersStores",
  },
  {
    path: "/exporter/:id",
    // name: "لوحه المعلومات",
    // icon: "nc-icon nc-bank",
    component: AddExporterForm,
    layout: "/admin/distributersStores",
  },
  {
    path: "/addStoreForm",
    // name: "لوحه المعلومات",
    // icon: "nc-icon nc-bank",
    component: AddStoreForm,
    layout: "/admin/distributersStores",
  },
  {
    path: "/addDistributerForm",
    // name: "لوحه المعلومات",
    // icon: "nc-icon nc-bank",
    component: AddDistributerForm,
    layout: "/admin/distributersStores",
  },
  {
    path: "/addExporterForm",
    // name: "لوحه المعلومات",
    // icon: "nc-icon nc-bank",
    component: AddExporterForm,
    layout: "/admin/distributersStores",
  },
];
export default routes;
