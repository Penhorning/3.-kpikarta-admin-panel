import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./assets/scss/style.scss";
import { SnackbarProvider } from 'notistack';
import Spinner from "./views/spinner-loader/spinner-loader";

const App = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("./app")), 0);
    })
);

ReactDOM.render(
  <Suspense fallback={<Spinner />}>
    <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>
  </Suspense>,
  document.getElementById("root")
);
