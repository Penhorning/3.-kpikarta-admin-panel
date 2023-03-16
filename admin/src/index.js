import React, { Suspense, lazy } from "react";
import { SnackbarProvider } from 'notistack';
import ReactDOM from "react-dom";
import Spinner from "./views/spinner-loader/spinner-loader";
import 'core-js/actual';
import 'globalthis/auto';
import "./assets/scss/style.scss";

// if (typeof globalThis === 'undefined') {
//   Object.defineProperty(Object.prototype, '__magic__', {
//     get: function() {
//       return this;
//     },
//     configurable: true,
//   });
//   var __magic__ = {};
//   __magic__.globalThis = __magic__;
//   delete Object.prototype.__magic__;
// }


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