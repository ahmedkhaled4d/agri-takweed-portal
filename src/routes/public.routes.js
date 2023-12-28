/**
 * public routes
 */
import Error404Page from "views/public/errors/404";

/**
 * protected routes
 */

import LoginForm from "views/public/Login/LoginForm";

let routes = [
  {
    path: "/",
    name: "landing page",
    component: Error404Page,
    layout: "/",
  },
  {
    path: "/404",
    name: "404",
    component: Error404Page,
    layout: "",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginForm,
    layout: "",
  },
];
export default routes;
