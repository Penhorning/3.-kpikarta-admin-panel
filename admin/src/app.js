import React from "react";
import { useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/Store";
import { History } from "./shared/_helpers";
import { PrivateRoute } from "./routes/PrivateRoutes";
import BlankLayout from "./layouts/blankLayout";
import indexRoutes from "./routes/";
import 'core-js/actual';

const App = () => {
  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);
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
  setTimeout(cb, 3000);
}

export default App;
