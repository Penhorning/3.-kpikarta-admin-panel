import { AuthHeader, HandleResponse,Constants } from "../_helpers";

export const UserService = {
  getAll,
  getUserCount,
};

function getAll() {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/users`, requestOptions).then(HandleResponse);
}
function getUserCount() {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/users/count`, requestOptions).then(HandleResponse);
}
