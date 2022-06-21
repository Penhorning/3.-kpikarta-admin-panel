import { AuthenticationService } from "../_services";

export function HandleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        if(data.error && data.error.code==='LOGIN_FAILED'){
          // ignore reload if trying to login
        } else {
          AuthenticationService.logout();
          window.location.reload(true);
        }
      }

      const error = (data && data.message) || data.error || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
