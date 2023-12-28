import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import ProtectedAdminRoute from "components/Routes/ProtectedAdminRoute";

// css
import "assets/admin/scss/paper-dashboard.scss?v=1.3.0";
import "assets/admin/css/react search autocomplete.css";
import "assets/client/assets/css/meanmenu.min.css";
import "assets/client/assets/css/barfiller.css";
import "assets/client/assets/css/style.css";
import "assets/client/assets/css/responsive.css";
import "assets/client/assets/css/rtl.css";
import "assets/client/assets/fonts/font.css";

import PublicLayout from "layouts/Public";
import GeneralFallBack from "components/general/GeneralFallBack/GeneralFallBack.js";
import UserStore from "contexts/user";
const AdminLayout = React.lazy(() => import("layouts/Admin"));

ReactDOM.render(
  <BrowserRouter>
    <Suspense fallback={<GeneralFallBack />}>
      <UserStore>
        <Switch>
          <ProtectedAdminRoute path="/admin" component={AdminLayout} />

          {/* <Route
          path="/sellcrops"
          exact
          render={() =>
            (window.location = 'https://www.mahaseel.org/quotation')
          }
        /> */}

          <Route path="/" render={(props) => <PublicLayout {...props} />} />
        </Switch>
      </UserStore>
    </Suspense>
  </BrowserRouter>,
  document.getElementById("root")
);
