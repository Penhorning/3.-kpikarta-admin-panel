import { lazy } from "react";
const FullLayout = lazy(() => import("../layouts/fullLayout.js"));
const BlankLayout = lazy(() => import("../layouts/blankLayout.js"));
const Dashboard = lazy(() => import("../views/dashboard/dashboard"));

var indexRoutes = [
  { path: "/authentication", name: "Athentication", component: BlankLayout },
  { path: "/", name: "Dashboard", component: FullLayout },
];

export default indexRoutes;
