import { lazy } from "react";
const NewUser = lazy(() => import("../views/users/new-user/new-user"));
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Users = lazy(() => import("../views/users/users"));
const Suggestions = lazy(() => import("../views/suggestions/suggestions"));
const ChangePassword = lazy(() => import("../views/change-password/change-password"));
const EditUser = lazy(() => import("../views/users/edit-user/edit-user"));
const MySuggestion = lazy(() => import("../views/users/my-suggestion/my-suggestion"));
const ViewUser = lazy(() => import("../views/users/view-user/view-user"));
const ViewAdmin = lazy(() => import("../views/users/view-admin/view-admin"));
const SubscriptionPlan = lazy(() => import("../views/users/subscription-plan/subscription-plan"));
const AddNewPlan = lazy(() => import("../views/users/subscription-plan/add-new-plan/add-new-plan"));
const EditPlan = lazy(() => import("../views/users/subscription-plan/update-plan/edit-plan"));



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
    icon: "mdi mdi-book",
    component: Suggestions,
    sideRoute: true,

  },
  {
    path: "/settings",
    name: "Settings",
    icon: "mdi mdi-settings",
    component: ChangePassword,
    sideRoute: true,
  },
  {
    path: "/newuser",
    name: "New-user",
    icon: "mdi mdi-gauge",
    component: NewUser,
    sideRoute: false,
  },
  {
    path: "/edit-user/:id",
    name: "Edit-user",
    icon: "mdi mdi-gauge",
    component: EditUser,
    sideRoute: false,
  },
  {
    path: "/my-suggestion/:id",
    name: "My-Suggestion",
    icon: "mdi mdi-gauge",
    component: MySuggestion,
    sideRoute: false,
  },
  {
    path: "/view-user/:id",
    name: "view-user",
    icon: "mdi mdi-gauge",
    component: ViewUser,
    sideRoute: false,
  },
  {
    path: "/viewadmin",
    name: "view-admin",
    icon: "mdi mdi-gauge",
    component: ViewAdmin,
    sideRoute: false,
  },
  {
    path: "/subscription-plans",
    name: "Subscription Plans",
    icon: "mdi mdi-book-multiple",
    component: SubscriptionPlan,
    sideRoute: true,
  },
  {
    path: "/addnewplan",
    name: "Add new plan",
    icon: "mdi mdi-gauge",
    component: AddNewPlan,
    sideRoute: false,
  },
  {
    path: "/editplan/:id",
    name: "Update plan",
    icon: "mdi mdi-gauge",
    component: EditPlan,
    sideRoute: false,
  },
  {
    path: "/",
    pathTo: "/dashboard",
    name: "Dashboard",
    redirect: true,
    sideRoute: true,
  }
  
];
export default ThemeRoutes;
