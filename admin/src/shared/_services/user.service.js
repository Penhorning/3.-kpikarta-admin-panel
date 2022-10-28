import { AuthHeader, HandleResponse, Constants } from "../_helpers";

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
  getCompanyDetails,
  addNewPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
  updateSubscriptionPlanStatus,
  getSubscriptionPlanById
};

async function getAll(data) {
  const requestOptions = {
    method: "POST", headers: AuthHeader(), body: JSON.stringify({
      page: data.page,
      limit: data.limit,
      search_query: data.search,
      start: data.start,
      end: data.end
    })
  };
  return await fetch(Constants.BASE_URL + `/api/users/get-all`, requestOptions).then(HandleResponse);
}

async function blockUser(userId, page, rowsPerPage) {
  const requestOptions = {
    method: "PUT", headers: AuthHeader(), body: JSON.stringify({
      userId: userId,
      page: page,
      limit: rowsPerPage

    })
  };
  return await fetch(Constants.BASE_URL + `/api/users/block`, requestOptions).then(HandleResponse);
}

async function unBlockUser(userId, page, rowsPerPage) {
  const requestOptions = {
    method: "PUT", headers: AuthHeader(), body: JSON.stringify({
      userId: userId,
      page: page,
      limit: rowsPerPage

    })
  };
  return await fetch(Constants.BASE_URL + `/api/users/unblock`, requestOptions).then(HandleResponse);
}

async function getUserCount() {
  const requestOptions = { method: "POST", headers: AuthHeader() };
  return await fetch(Constants.BASE_URL + `/api/users/count`, requestOptions).then(HandleResponse);
}

async function getUserDetails(id) {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return await fetch(Constants.BASE_URL + `/api/users/${id}`, requestOptions).then(HandleResponse);
}

async function addUser(data) {
  const requestOptions = {
    method: "POST", headers: AuthHeader(), body: JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      companyName: data.companyName,
      type: "admin"
    })
  };
  return await fetch(Constants.BASE_URL + `/api/users`, requestOptions).then(HandleResponse);
}

async function updateUser(id, data) {
  const requestOptions = {
    method: "PATCH", headers: AuthHeader(), body: JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      telephone: data.telephone,
      profilePic: data.profilePic
    })
  };
  return await fetch(Constants.BASE_URL + `/api/users/${id}`, requestOptions).then(HandleResponse);
}

async function upadateCompanyDetails(companyIds, data) {
  const requestOptions = {
    method: "PATCH", headers: AuthHeader(), body: JSON.stringify({
      name: data.name,
      job_title: data.job_title,
      departmentId: data.departmentId,
      employeesRangeId: data.employeesRangeId,
      oldCompanyLogo: data.oldCompanyLogo,
      logo: data.logo,
    })
  };
  return await fetch(Constants.BASE_URL + `/api/companies/${companyIds}`, requestOptions).then(HandleResponse);
}

async function getDepartment() {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return await fetch(Constants.BASE_URL + `/api/departments`, requestOptions).then(HandleResponse);
}

async function getEmployeeRange() {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return await fetch(Constants.BASE_URL + `/api/employee_ranges`, requestOptions).then(HandleResponse);
}

async function getCompanyDetails(id) {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return await fetch(Constants.BASE_URL + `/api/companies/findOne?filter[where][userId]=${id}`, requestOptions).then(HandleResponse);
}

async function addNewPlan(data) {
  const requestOptions = {
    method: "POST", headers: AuthHeader(), body: JSON.stringify({
      planName: data.plan_name,
      amount: data.amount,
      description: data.description,
      duration: data.duration,
      userId: data.userId
    })
  };
  return await fetch(Constants.BASE_URL + `/api/subscriptions/create-plan`, requestOptions).then(HandleResponse);
}

async function getSubscriptionPlans(userId) {
  const data = {
    where: {
      user_id: userId
    }
  }
  return await fetch(Constants.BASE_URL + `/api/subscriptions?filter[order]=createdAt Desc`).then(HandleResponse);
}

async function getSubscriptionPlanById(id) {
  return await fetch(Constants.BASE_URL + `/api/subscriptions/${id}`).then(HandleResponse);
}

async function updateSubscriptionPlan(id, data) {
  const requestOptions = {
    method: "PATCH", headers: AuthHeader(), body: JSON.stringify({
      planName: data.plan_name,
      description: data.description,
      userId: data.userId,
      planId: data.planId
    })
  };
  return await fetch(Constants.BASE_URL + `/api/subscriptions/${id}`, requestOptions).then(HandleResponse);
}

async function updateSubscriptionPlanStatus(data) {
  const requestOptions = {
    method: "PUT", headers: AuthHeader(), body: JSON.stringify({
      planId: data.planId,
      status: data.status
    })
  };
  return await fetch(Constants.BASE_URL + `/api/subscriptions/change-plan-status`, requestOptions).then(HandleResponse);
}