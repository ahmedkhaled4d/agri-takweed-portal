import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedHagrRoute = ({ component: Component, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          localStorage.getItem('token') &&
          localStorage.getItem('user') &&
          localStorage.getItem('_r') === '124FC5612ce12'
        ) {
          return <Component {...rest} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedHagrRoute;
