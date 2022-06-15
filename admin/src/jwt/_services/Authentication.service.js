import { BehaviorSubject } from "rxjs";

import { HandleResponse,Constants } from "../_helpers";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

export const AuthenticationService = {
  login,
  logout,
  changePassword,
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

  return fetch(Constants.BASE_URL+`/api/users/login`, requestOptions)
    .then(HandleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("currentUser", JSON.stringify(user));
      currentUserSubject.next(user);
      return user;
    });
}

function changePassword(newPassword) {
  const requestOptions = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization":JSON.parse(localStorage.getItem("currentUser")).id 
    },
    body: JSON.stringify({ newPassword }),
  };

  return fetch(Constants.BASE_URL+`/api/users/reset-password`, requestOptions)
    .then(HandleResponse)
    .then((user) => {
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
}
