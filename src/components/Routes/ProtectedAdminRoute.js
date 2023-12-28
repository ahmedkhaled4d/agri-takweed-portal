import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedAdminRoute = ({ component: Component, user, ...rest }) => {

  return (
    <Route {...rest} render={
      props => {
        if (localStorage.getItem('token') && localStorage.getItem('user') && localStorage.getItem('_r') === '324FC5612ce4E') {
          return <Component {...rest} {...props} />
        } else {
          return <Redirect to={
            {
              pathname: '/login',
              state: {
                from: props.location
              }
            }
          } />
        }
      }
    } />
  )
}

export default ProtectedAdminRoute;