import { AuthHeader, HandleResponse, Constants } from "../_helpers";


const getPhases = () => {
  let requestOptions = {
    method: "GET",
    headers: AuthHeader()
  };
  return fetch(Constants.BASE_URL +`/api/kartaphases`, requestOptions).then(HandleResponse);
}

const getSuggestion = (data) => {
  let requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(data)
  };
  return fetch(Constants.BASE_URL+`/api/suggestion-by-phase`, requestOptions).then(HandleResponse);
}

const updateSuggestion = (suggestionId, data) => {
  let requestOptions = {
    method: "PATCH",
    headers: AuthHeader(),
    body: JSON.stringify(data)
  };
  return fetch(Constants.BASE_URL+`/api/suggestions/${suggestionId}`, requestOptions).then(HandleResponse);
}

export const SuggestionService = {
  getPhases,
  getSuggestion,
  updateSuggestion
};
