import { lazy } from "react";
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Users = lazy(() => import("../views/users/Users"));
const Suggestions = lazy(() => import("../views/suggestions/suggestions"));
const ChangePassword = lazy(() => import("../views/change-password/ChangePassword"));

var ThemeRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "mdi mdi-gauge",
    component: Dashboard,
  },
  {
    path: "/users",
    name: "Users",
    icon: "mdi mdi-account-multiple",
    component: Users,
  },
  {
    path: "/suggestions",
    name: "Suggestions",
    icon: "mdi mdi-gauge",
    component: Suggestions,
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
