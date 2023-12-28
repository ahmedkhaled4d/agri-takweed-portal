/*!

*/
import List from "./List";
import VarietiesList from './VarietiesList';


var routes = [
  {
    path: "/",
    component: List,
    layout: "/admin/crops",
  },
  {
    path: "/:id",
    component: VarietiesList,
    layout: "/admin/crops",
  },
   
];
export default routes;
