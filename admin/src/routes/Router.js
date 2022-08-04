import { lazy } from "react";
import Newuser from "../views/users/newuser";
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
    sideRoute: true,
  },
  {
    path: "/users",
    name: "Users",
    icon: "mdi mdi-account-multiple",
    component: Users,
    sideRoute: true,

  },
  {
    path: "/suggestions",
    name: "Suggestions",
    icon: "mdi mdi-gauge",
    component: Suggestions,
    sideRoute: true,

  },
  {
    path: "/settings",
    name: "Settings",
    icon: "mdi mdi-gauge",
    component: ChangePassword,
    sideRoute: true,
  },
  {
    path: "/newuser",
    name: "newuser",
    icon: "mdi mdi-gauge",
    component: Newuser,
    sideRoute: false,
  },

  {
    path: "/",
    pathTo: "/dashboard",
    name: "Dashboard",
    redirect: true,
    sideRoute: true,
  },
];
export default ThemeRoutes;
