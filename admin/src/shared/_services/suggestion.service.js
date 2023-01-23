import { AuthHeader, HandleResponse, Constants } from "../_helpers";


const getPhases = () => {
  let requestOptions = {
    method: "GET",
    headers: AuthHeader()
  };
  return fetch(Constants.BASE_URL +`/api/karta_phases?filter={"where": {"kartaId": {"exists": false}}}`, requestOptions).then(HandleResponse);
}

const getSuggestion = (data) => {
  let requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(data)
  };
  return fetch(Constants.BASE_URL+`/api/suggestions/global`, requestOptions).then(HandleResponse);
}

const updateSuggestion = (suggestionId, data) => {
  let requestOptions = {
    method: "PATCH",
    headers: AuthHeader(),
    body: JSON.stringify(data)
  };
  return fetch(Constants.BASE_URL+`/api/suggestions/${suggestionId}`, requestOptions).then(HandleResponse);
}

const createSuggestion = (userId, phaseId, data) => {
  let requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify({
      definition: data.definition,
      descriptions: data.descriptions,
      userId,
      phaseId
    })
  };
  return fetch(Constants.BASE_URL+`/api/suggestions`, requestOptions).then(HandleResponse);
}

const getMySuggestion = (phaseId,userId) => {
  let requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify({
     phaseId,
     userId
    })
  };
  return fetch(Constants.BASE_URL+`/api/suggestions/by-user`, requestOptions).then(HandleResponse);
}

const deleteSuggestion = (data) => {
  let requestOptions = {
    method: "DELETE",
    headers: AuthHeader(),
  };
  return fetch(Constants.BASE_URL+`/api/suggestions/${data}`, requestOptions).then(HandleResponse);
}
export const SuggestionService = {
  getPhases,
  getSuggestion,
  updateSuggestion,
  getMySuggestion,
  createSuggestion,
  deleteSuggestion
};
