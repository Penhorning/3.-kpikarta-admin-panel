import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthenticationService } from "../shared/_services";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentUser = AuthenticationService.currentUserValue;
      const isPublicRoute = props.location.pathname.startsWith('/authentication/forgot-password');
      if (!currentUser && !isPublicRoute) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{
              pathname: "/authentication/login",
              state: { from: props.location },
            }}
          />
        );
      }

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;
