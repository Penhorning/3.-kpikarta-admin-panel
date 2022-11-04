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

const blockUser = async (userId, page, rowsPerPage, enqueueSnackbar) => {
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
      type: "admin"
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
    const response = await axios.get(Constants.BASE_URL + `/api/subscriptions?filter[order]=createdAt Desc`, {
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

const getSubscriptionPlanById = async (id, enqueueSnackbar) => {
  try {
    const response = await axios.get(Constants.BASE_URL + `/api/subscriptions/${id}`, {}, { headers: AuthHeader() })
    return response.data;
  } catch (err) {
    const error = handleError(err);
    const errorResp = HandleErrorResponse(error)
    let variant = 'error';
    if (error !== "Unauthorized") enqueueSnackbar(errorResp, { variant })
    return error
  }
}

const updateSubscriptionPlan = async (id, data, enqueueSnackbar) => {
  try {
    const response = await axios.patch(Constants.BASE_URL + `/api/subscriptions/${id}`, {
      planName: data.plan_name,
      description: data.description,
      userId: data.userId,
      planId: data.planId
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
    return 'Your session expired';
  } else if (error.error.statusCode === 401 && error.error.message === "login failed") {
    return 'Please enter correct email address or password.';
  } else if (error.error.statusCode === 400 || error.error.statusCode === 404) {
    return error.error.message ? error.error.message : 'Something went worng!';
  } else if (error.error.statusCode >= 500 && error.error.statusCode <= 505) {
    return 'Something went worng!';
  }else {
    AuthenticationService.logout();
    window.location.reload(true);
  }
  return error;
}

export const UserService = {
  getAll,
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
  updateLicensePlan
};