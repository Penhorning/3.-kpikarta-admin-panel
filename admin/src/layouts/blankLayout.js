import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AuthRoutes from "../routes/AuthRoutes.js";

const Blanklayout = () => {
  return (
    <div className="authentications">
      <Switch>
        {AuthRoutes.map((prop, key) => {
          if(localStorage.getItem("currentUser")){
            return <Redirect to='/dashboard' />
          }
          if (prop.redirect)
            return <Redirect from={prop.path} to={prop.path} key={key} />;
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        })}
      </Switch>
    </div>
  );
};
export default Blanklayout;
