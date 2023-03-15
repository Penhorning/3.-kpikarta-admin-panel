import React, { Suspense, lazy } from "react";
import { SnackbarProvider } from 'notistack';
import ReactDOM from "react-dom";
import Spinner from "./views/spinner-loader/spinner-loader";
import 'core-js/actual';
import "./assets/scss/style.scss";

const App = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("./app")), 0);
    })
);

ReactDOM.render(
  <Suspense fallback={<Spinner />}>
    <SnackbarProvider maxSnack={1}>
    <App />
  </SnackbarProvider>
  </Suspense>,
  document.getElementById("root")
);