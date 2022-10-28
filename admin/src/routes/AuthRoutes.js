import { lazy } from "react";
const Login = lazy(() => import("../views/authentication/login"));
const ForgotPassword = lazy(() => import("../views/authentication/forgot-password"));

var authRoutes = [
  {
    path: "/authentication/login",
    name: "Login",
    icon: "mdi mdi-account-key",
    component: Login,
  },
  {
    path: "/authentication/forgot-password",
    name: "Forgot password",
    icon: "mdi mdi-account-key",
    component: ForgotPassword,
  },
];
export default authRoutes;
