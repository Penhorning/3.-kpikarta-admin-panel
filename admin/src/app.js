import React from "react";
import indexRoutes from "./routes/";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/Store";
import { History } from "./jwt/_helpers";
import { PrivateRoute } from "./routes/PrivateRoutes";
import BlankLayout from "./layouts/BlankLayout";
import Newuser from "./views/users/newuser";

const App = () => {
  return (
    <Provider store={configureStore()}>
      <Router history={History}>
        <Switch>
          <Route exact path="/authentication/Login" component={BlankLayout} />;
          {indexRoutes.map((prop, key) => {
            return (
              <PrivateRoute
                path={prop.path}
                key={key}
                component={prop.component}
              />
            );
          })}
        </Switch>
      </Router>
    </Provider>
  );
};

window.alertTimeout = function(cb){
  setTimeout(cb,3000);
}

export default App;
