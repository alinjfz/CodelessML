import * as authActions from "../actions/auth";
import {
  train_predict_data,
  train_clear_error,
  train_error,
} from "../actions/train";
import { PREDICT_DATA_API } from "../constants/ApiRoutes";
const options = {
  credentials: "include",
  mode: "cors",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "application/json",
    // "Access-Control-Allow-Headers": "*",
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Request-Headers": "*",
  },
};
let requestOptions = {};

export const api_predict_data = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(train_clear_error());
  dispatch(train_predict_data({ loading: true }));
  const resdata = await fetch(PREDICT_DATA_API, requestOptions)
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
      if (status === 401) dispatch(authActions.auth_logout_user());
      if (String(error).startsWith("TypeError: Failed to fetch")) {
        dispatch(train_error("error"));
        return;
      }
      dispatch(train_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(train_predict_data(resdata));
  }
};
