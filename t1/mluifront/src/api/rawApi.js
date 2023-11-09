import { api_route } from "../constants/Api";

const options = {
  credentials: "include",
  mode: "cors",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "application/json",
  },
};
let requestOptions = {};
export const api_test_private = async () => {
  requestOptions = {
    ...options,
    method: "GET",
  };
  let status = 0;
  const resdata = await fetch(api_route + "privatetest", requestOptions)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        return data;
      }
      throw data;
    })
    .catch((error) => {
      console.log("error:", error);
      return null;
    });
  if (status === 200) {
    console.log(resdata);
  }
};
export const api_login = (x, apiActions) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  const resdata = await fetch(api_route + "login", requestOptions)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        return data.message;
      }
      throw data;
    })
    .catch((error) => {
      if (status === 401) dispatch(apiActions.auth_logout_user());
      else dispatch(apiActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(apiActions.auth_reset_password(resdata));
  }
};
