import { AuthHeader, HandleResponse,Constants } from "../_helpers";

export const UserService = {
  getAll,
  getUserCount,
  blockUser,
  unBlockUser,
  addUser,
  getUserId,
  updateUser,
  getDepartment,
  getEmployeeRange,
  upadateCompanyDetails,
  getCompanyID
};

function getAll(data) {
  const requestOptions = { method: "POST", headers: AuthHeader(),body:JSON.stringify({
    page: data.page,
    limit: data.limit,
    search_query: data.search,
    start: data.start,
    end: data.end
}) };
  return fetch(Constants.BASE_URL+`/api/users/get-all`, requestOptions).then(HandleResponse);
}

function blockUser(userId,page,rowsPerPage) {
  const requestOptions = { method: "PUT", headers: AuthHeader(),body:JSON.stringify({
     userId : userId ,
      page : page,
    limit : rowsPerPage
    
    }) };
  return fetch(Constants.BASE_URL+`/api/users/block`, requestOptions).then(HandleResponse);
}

function unBlockUser(userId,page,rowsPerPage) {
  const requestOptions = { method: "PUT", headers: AuthHeader(),body:JSON.stringify({ 
    userId : userId ,
      page : page,
    limit : rowsPerPage
  
  }) };
  return fetch(Constants.BASE_URL+`/api/users/unblock`, requestOptions).then(HandleResponse);
}

function getUserCount() {
  const requestOptions = { method: "POST", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/users/count`, requestOptions).then(HandleResponse);
}

function getUserId(id) {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/users/${id}`, requestOptions).then(HandleResponse);
}

function addUser(data) {
  const requestOptions = { method: "POST", headers: AuthHeader(),body:JSON.stringify({
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    companyName: data.companyName,
    type:"admin"
}) };
  return fetch(Constants.BASE_URL+`/api/users`, requestOptions).then(HandleResponse);
}

function updateUser(id,data) {
  const requestOptions = { method: "PATCH", headers: AuthHeader(),body:JSON.stringify({
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    telephone: data.telephone
}) };
  return fetch(Constants.BASE_URL+`/api/users/${id}`, requestOptions).then(HandleResponse);
}


function getDepartment() {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/departments`, requestOptions).then(HandleResponse);
}

function getEmployeeRange() {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/employees_ranges`, requestOptions).then(HandleResponse);
}

function getCompanyID(id) {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/companies/findOne?filter[where][userId]=${id}`, requestOptions).then(HandleResponse);
} 

function upadateCompanyDetails(companyIds,data) {
  const requestOptions = { method: "PATCH", headers: AuthHeader(),body:JSON.stringify({
    name: data.name,
    job_title: data.job_title,
    departmentId: data.departmentId,
    employeesRangeId: data.employeesRangeId
}) };
  return fetch(Constants.BASE_URL+`/api/companies/${companyIds}`, requestOptions).then(HandleResponse);
}