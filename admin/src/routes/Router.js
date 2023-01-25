import { lazy } from "react";

const Dashboard = lazy(() => import("../views/dashboard/dashboard"));

const Users = lazy(() => import("../views/user/user"));
const AddUser = lazy(() => import("../views/user/add-user/add-user"));
const EditUser = lazy(() => import("../views/user/edit-user/edit-user"));
const ViewUser = lazy(() => import("../views/user/view-user/view-user"));

const Suggestions = lazy(() => import("../views/suggestions/suggestions"));
const MySuggestion = lazy(() => import("../views/user/my-suggestion/my-suggestion"));

const SubscriptionPlan = lazy(() => import("../views/subscription-plan/subscription-plan"));
const AddPlan = lazy(() => import("../views/subscription-plan/add-plan/add-plan"));
const EditPlan = lazy(() => import("../views/subscription-plan/edit-plan/edit-plan"));

const EditProfile = lazy(() => import("../views/admin/edit-profile/edit-profile"));
const ChangePassword = lazy(() => import("../views/admin/change-password/change-password"));

const EditLicense = lazy(() => import("../views/license/edit-lisence/edit-license"));

const Transaction = lazy(() => import("../views/transactions-management/transaction-management"));
const Inventory = lazy(() => import("../views/inventory/inventory"));
const Tab = lazy(() => import("../views/inventory/tab/tab"))

const TrialPeriod = lazy(()=> import('../views/subscription-plan/trialPeriod/trialPeriod'))


// const AddPlan = lazy(() => import("../views/subscription-plan/add-plan/add-plan"));






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
    name: "Companies",
    icon: "mdi mdi-account-multiple",
    component: Users,
    sideRoute: true
  },
  {
    path: "/add-user",
    name: "Add-user",
    icon: "mdi mdi-gauge",
    component: AddUser,
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
    sideRoute: false
  },
  {
    path: "/subscription-plans",
    name: "Subscription",
    icon: "mdi mdi-book-multiple",
    component: SubscriptionPlan,
    sideRoute: true
  },
  {
    path: "/add-plan",
    name: "Add plan",
    icon: "mdi mdi-gauge",
    component: AddPlan,
    sideRoute: false
  },
  {
    path: "/edit-plan/:id",
    name: "Edit plan",
    icon: "mdi mdi-gauge",
    component: EditPlan,
    sideRoute: false
  },
  {
    path: "/edit-profile",
    name: "edit-profile",
    icon: "mdi mdi-gauge",
    component: EditProfile,
    sideRoute: false
  },
  {
    path: "/edit-license/:id",
    name: "Edit License",
    icon: "mdi mdi-gauge",
    component: EditLicense,
    sideRoute: false
  },
  {
    path: "/inventory/:id",
    name: "Edit License",
    icon: "mdi mdi-gauge",
    component: Tab,
    sideRoute: false
  },
  {
    path: "/transaction",
    name: "Transactions",
    icon: "mdi mdi-bank",
    component: Transaction,
    sideRoute: true
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
