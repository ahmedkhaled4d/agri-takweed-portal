import React from 'react';
// javascript plugin used to create scrollbars on windows
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import Header from 'components/client/Header/Header';
import Footer from 'components/client/Footer/Footer';
import MobileFooter from 'components/client/MobileFooter';

/**
 * import CSS files here
 */
// import 'assets/client/assets/fonts/font.css';
// import UserStore from 'contexts/user';

import routes from '../routes/public.routes';
// export const UserContext = React.createContext();

function Public(props) {
  const location = useLocation();

  React.useEffect(() => {
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  return (
    // <UserStore>
    <div className="">
      <Header {...props} />

      <Switch>
        {routes.map((prop, key) => {
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
        <Redirect to="/404" />
      </Switch>
      <MobileFooter />

      <Footer fluid />
    </div>
    // </UserStore>
  );
}

export default Public;
