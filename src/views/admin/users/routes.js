/*!

*/
import View from "./view";
import List from "./List";


var routes = [
  {
    path: "/",
    name: "لوحه المعلومات",
    icon: "nc-icon nc-bank",
    component: List,
    layout: "/admin/users",
  },
  {
    path: "/view/:id",
    name: "لوحه المعلومات",
    icon: "nc-icon nc-bank",
    component: View,
    layout: "/admin/users",
  },

  
];
export default routes;
