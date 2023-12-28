import React from "react";
import { Route, Switch } from "react-router-dom";
import routes from "./routes";

function Tables() {
  return (
    <>
      <Switch>
        {routes.map((prop, key) => {
          return (
            <Route exact
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
      </Switch>
    </>
  );
}
export default Tables;
