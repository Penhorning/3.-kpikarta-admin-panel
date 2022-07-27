import { AuthHeader, HandleResponse,Constants } from "../_helpers";

export const UserService = {
  getAll,
  getUserCount,
  blockUser,
  unBlockUser
};

function getAll(data) {
  const requestOptions = { method: "POST", headers: AuthHeader(),body:JSON.stringify({
    page: data.page,
    limit: data.limit,
    search_query: data.search
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
