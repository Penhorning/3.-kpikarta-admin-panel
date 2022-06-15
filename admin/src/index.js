import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./assets/scss/style.scss";
import Spinner from "./views/spinner/Spinner";

const App = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("./app")), 0);
    })
);

ReactDOM.render(
  <Suspense fallback={<Spinner />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
