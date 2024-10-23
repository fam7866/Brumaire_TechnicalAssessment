import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({
  component: Component,
  isAuthenticated,
  // active,
  ...restOfProps
}) {
  return (
    <Route
      {...restOfProps}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
}

export default ProtectedRoute;
