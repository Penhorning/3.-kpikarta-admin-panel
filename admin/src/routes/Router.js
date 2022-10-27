import { lazy } from "react";

const Dashboard = lazy(() => import("../views/dashboard/dashboard"));

const Users = lazy(() => import("../views/users/users"));
const NewUser = lazy(() => import("../views/users/new-user/new-user"));
const EditUser = lazy(() => import("../views/users/edit-user/edit-user"));
const ViewUser = lazy(() => import("../views/users/view-user/view-user"));

const Suggestions = lazy(() => import("../views/suggestions/suggestions"));
const MySuggestion = lazy(() => import("../views/users/my-suggestion/my-suggestion"));

const SubscriptionPlan = lazy(() => import("../views/subscription-plan/subscription-plan"));
const AddNewPlan = lazy(() => import("../views/subscription-plan/add-new-plan/add-new-plan"));
const EditPlan = lazy(() => import("../views/subscription-plan/update-plan/edit-plan"));

const EditProfile = lazy(() => import("../views/users/view-admin/view-admin"));
const ChangePassword = lazy(() => import("../views/change-password/change-password"));


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
    sideRoute: true
  },
  {
    path: "/new-user",
    name: "New-user",
    icon: "mdi mdi-gauge",
    component: NewUser,
    sideRoute: false
  },
  {
    path: "/edit-user/:id",
    name: "Edit-user",
    icon: "mdi mdi-gauge",
    component: EditUser,
    sideRoute: false
  },
  {
    path: "/view-user/:id",
    name: "view-user",
    icon: "mdi mdi-gauge",
    component: ViewUser,
    sideRoute: false
  },
  {
    path: "/suggestions",
    name: "Suggestions",
    icon: "mdi mdi-book",
    component: Suggestions,
    sideRoute: true
  },
  {
    path: "/my-suggestion/:id",
    name: "My-Suggestion",
    icon: "mdi mdi-gauge",
    component: MySuggestion,
    sideRoute: false
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "mdi mdi-settings",
    component: ChangePassword,
    sideRoute: true
  },
  {
    path: "/subscription-plans",
    name: "Subscription Plans",
    icon: "mdi mdi-book-multiple",
    component: SubscriptionPlan,
    sideRoute: true
  },
  {
    path: "/new-plan",
    name: "Add new plan",
    icon: "mdi mdi-gauge",
    component: AddNewPlan,
    sideRoute: false
  },
  {
    path: "/edit-plan/:id",
    name: "Update plan",
    icon: "mdi mdi-gauge",
    component: EditPlan,
    sideRoute: false
  },
  {
    path: "/view-admin",
    name: "view-admin",
    icon: "mdi mdi-gauge",
    component: EditProfile,
    sideRoute: false
  },
  {
    path: "/",
    pathTo: "/dashboard",
    name: "Dashboard",
    redirect: true,
    sideRoute: true
  }
  
];
export default ThemeRoutes;
