import React, { Suspense, lazy } from "react";
import { SnackbarProvider } from 'notistack';
import ReactDOM from "react-dom";
import Spinner from "./views/spinner-loader/spinner-loader";
import 'globalthis/auto';

// Use the globalThis object
import 'core-js/actual';
import "./assets/scss/style.scss";
// import 'globalthis/auto';
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