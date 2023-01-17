import { BehaviorSubject } from "rxjs";
import { HandleResponse,Constants,AuthHeader } from "../_helpers";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

export const AuthenticationService = {
  login,
  logout,
  changePassword,
  requestForgotPassword,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

function login(email, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };

  return fetch(Constants.BASE_URL+`/api/users/login/admin`, requestOptions)
    .then(HandleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      if(user?.error?.statusCode == 400){
        return user
      } else {
        localStorage.setItem("currentUser", JSON.stringify(user));
        currentUserSubject.next(user);
        return user;
      }
     
    });
}

function changePassword(oldPassword,newPassword) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify({ oldPassword,newPassword }),
  };

  return fetch(Constants.BASE_URL+`/api/users/change-password`, requestOptions)
    .then(HandleResponse)
    .then((user) => {
      return user;
    });
}

function requestForgotPassword(email) {
  const requestOptions = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email }),
  };

  return fetch(Constants.BASE_URL+`/api/users/reset/admin`, requestOptions)
  .then(HandleResponse)
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
}
