import { AuthenticationService } from "../_services";

export function AuthHeader() {
  // return authorization header with jwt token
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && currentUser.id) {
    // return { Authorization: `Bearer ${currentUser.token}` };
    return { Authorization:JSON.parse(localStorage.getItem("currentUser")).id,   "Content-type": "application/json; charset=UTF-8" }
  } else {
    return {};
  }
}
