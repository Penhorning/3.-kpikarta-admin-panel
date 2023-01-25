import { AuthHeader, Constants } from "../_helpers";
import { AuthenticationService } from "../_services";

import axios from 'axios';

const getAll = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/users/get-all`, {
      page: data.page,
      limit: data.limit,
      searchQuery: data.search,
      start: data.start,
      end: data.end
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err, data);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getAllInvoicesChart = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/subscriptions/get-admin-invoices-chart`, {
      startDate: data.start,
      endDate: data.end
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err, data);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getAllInvoices = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/subscriptions/get-admin-invoices`, {
      page: data.page,
      limit: data.limit,
      searchQuery: data.search,
      previousId: data.previousId,
      nextId: data.nextId,
      startDate: data.start,
      endDate: data.end,
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err, data);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getAllKartas = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/karta/get-all`, {
      page: data.page,
      limit: data.limit,
      searchQuery: data.search,
      findBy: data.findBy
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err, data);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getInventory = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/karta_catalogs/get-all`, {
      page: data.page,
      limit: data.limit,
      searchQuery: data.search,
      nodeTypes: data.nodeType,
      userId: data.userId,
      type: "owned"
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err, data);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getAllCompanyMembers = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/users/get-all-members`, {
      page: data.page,
      limit: data.limit,
      searchQuery: data.search,
      type: "members",
      userId: data.userId
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err, data);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const blockUser = async (userId, page, rowsPerPage) => {
  try {
    const response = await axios.put(Constants.BASE_URL + `/api/users/block`, {
      userId: userId,
      page: page,
      limit: rowsPerPage
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized")
    return error
  }
}

const cancelSubscription = async (userId, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/subscriptions/cancel-subscription`, {
      userId: userId
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const unBlockUser = async (userId, page, rowsPerPage, enqueueSnackbar) => {
  try {
    const response = await axios.put(Constants.BASE_URL + `/api/users/unblock`, {
      userId: userId,
      page: page,
      limit: rowsPerPage
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getUserCount = async (enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/users/count`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getUserLicenseCount = async (enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/subscriptions/get-user-count`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getUserDetails = async (id, enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/users/${id}?filter[include]=company`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const addUser = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/users`, {
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      companyName: data.companyName,
      addedBy: "admin"
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const updateUser = async (id, data, enqueueSnackbar) => {
  try {
    const response = await axios.patch(Constants.BASE_URL + `/api/users/${id}`, {
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      telephone: data.telephone,
      profilePic: data.profilePic
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const upadateCompanyDetails = async (companyIds, data, enqueueSnackbar) => {
  try {
    const response = await axios.patch(Constants.BASE_URL + `/api/companies/${companyIds}`, {
      name: data.name,
      job_title: data.job_title,
      departmentId: data.departmentId,
      employeesRangeId: data.employeesRangeId,
      oldCompanyLogo: data.oldCompanyLogo,
      logo: data.logo
    },
      { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getDepartment = async (enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/departments`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getEmployeeRange = async (enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/employee_ranges`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const addNewPlan = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/subscriptions/create-plan`, {
      planName: data.plan_name,
      amount: data.amount,
      description: data.description,
      duration: data.duration,
      userId: data.userId
    }, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getSubscriptionPlans = async (userId, enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/subscriptions/get-admin-plans`, {
      where: {
        user_id: userId
      }
    }, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getTrialPeriod = async (enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/trial_periods`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const updateTrialPeriodPlan = async ( id, data, enqueueSnackbar) => {
  try {
    const response = await axios.put(Constants.BASE_URL + `/api/trial_periods/${id}`, {days: data.days}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getSubscriptionPlanById = async (id, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/subscriptions/get-plan`, {
      priceId : id
    }, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const updateSubscriptionPlan = async ( data, enqueueSnackbar) => {
  try {
    const response = await axios.post(Constants.BASE_URL + `/api/subscriptions/update-admin-plans`, {
      name: data.name,
      amount: data.price,
      priceId: data.priceId
    }, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const updateSubscriptionPlanStatus = async (data, enqueueSnackbar) => {
  try {
    const response = await axios.put(Constants.BASE_URL + `/api/subscriptions/change-plan-status`, {
      planId: data.planId,
      status: data.status
    }, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getLicense = async (userId, enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/licenses?filter[active]=true`, {
      where: {
        user_id: userId
      }
    }, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const getLicenseById = async (id, enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/licenses/${id}`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const updateLicensePlan = async (id, data, enqueueSnackbar) => {
  try {
    const response = await axios.patch(Constants.BASE_URL + `/api/licenses/${id}`, {
      name: data.name
    }, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const handleError = (err, data) => {
  if (err.response) {
    if (err.response.data === "Unauthorized") {
      data.handleUnauthorized()
    }
    return err.response.data
  } else if (err.request) {
    return { error: "Network error" }
  }
  return err
}

export function HandleErrorResponse (error) {
  if (error.error.statusCode === 401 &&
    (error.error.message === "Authorization Required" ||
      error.error.message === "could not find a valid user" ||
      error.error.message === "could not find accessToken")
  ) {
    localStorage.removeItem("currentUser");
    window.location.reload(true);
    return 'Your session expired';
  } else if (error.error.statusCode === 401 && error.error.message === "login failed") {
    return 'Please enter correct email address or password.';
  } else if (error.error.statusCode === 400 || error.error.statusCode === 404) {
    return error.error.message ? error.error.message : 'Something went worng!';
  } else if (error.error.statusCode >= 500 && error.error.statusCode <= 505) {
    return 'Something went worng!';
  }else if(error.error.statusCode === 422 && error?.error?.details?.codes.email[0] === "uniqueness"){
    return 'Email is already registered, please try with a different one!';
  } else {
    AuthenticationService.logout();
    window.location.reload(true);
  }
  return error;
}

// if (error.status === 422 && error.error.error.details.codes.email[0] === "uniqueness") {

//   this._commonService.errorToaster("Email is already registered, please try with a different one");

// }
export const UserService = {
  getAll,
  getAllCompanyMembers,
  getUserCount,
  blockUser,
  unBlockUser,
  addUser,
  getUserDetails,
  updateUser,
  getDepartment,
  getEmployeeRange,
  upadateCompanyDetails,
  addNewPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
  updateSubscriptionPlanStatus,
  getSubscriptionPlanById,
  getLicense,
  getLicenseById,
  updateLicensePlan,
  getInventory,
  getAllKartas,
  getAllInvoices,
  getAllInvoicesChart,
  getTrialPeriod,
  updateTrialPeriodPlan,
  cancelSubscription,
  getUserLicenseCount
};