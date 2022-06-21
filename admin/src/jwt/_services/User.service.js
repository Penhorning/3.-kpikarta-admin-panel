import { AuthHeader, HandleResponse,Constants } from "../_helpers";

export const UserService = {
  getAll,
};

function getAll() {
  const requestOptions = { method: "GET", headers: AuthHeader() };
  return fetch(Constants.BASE_URL+`/api/users`, requestOptions).then(HandleResponse);
}
