import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedClientRoute = ({ component: Component, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          localStorage.getItem('token') &&
          localStorage.getItem('user') &&
          localStorage.getItem('_r') === 'f1c6ec8381287e'
        ) {
          // console.log('welcomeee');
          return <Component {...rest} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/loginSellCropsUser',
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

export default ProtectedClientRoute;
