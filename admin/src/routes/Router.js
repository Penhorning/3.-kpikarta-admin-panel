import { lazy } from "react";
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const ChangePassword = lazy(() => import("../views/change-password/ChangePassword"));

var ThemeRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "mdi mdi-gauge",
    component: Dashboard,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "mdi mdi-gauge",
    component: ChangePassword,
  },

  { path: "/", pathTo: "/dashboard", name: "Dashboard", redirect: true },
];
export default ThemeRoutes;
