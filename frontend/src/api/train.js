import * as authActions from "../actions/auth";
import {
  train_suggest_algo,
  train_clear_error,
  train_error,
  train_get_algo_list,
  train_set_data,
  train_get_trained_list,
} from "../actions/train";
import {
  SUGGEST_ALGO_API,
  TRAIN_API,
  TRAIN_LIST_API,
} from "../constants/ApiRoutes";
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

export const api_suggest_algorithm = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(train_clear_error());
  dispatch(train_suggest_algo({ loading: true }));
  const resdata = await fetch(SUGGEST_ALGO_API, requestOptions)
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
    if (resdata.suggested_algorithm)
      dispatch(
        train_suggest_algo({ suggested_algorithm: resdata.suggested_algorithm })
      );
    if (resdata.algo_list) dispatch(train_get_algo_list(resdata.algo_list));
  }
};

export const api_train_it = (x, algo_name) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(train_clear_error());
  dispatch(train_set_data({ loading: true }));
  const resdata = await fetch(TRAIN_API + algo_name, requestOptions)
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
    dispatch(train_set_data(resdata));
  }
};

export const api_train_list = () => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    method: "GET",
  };
  let status = 0;
  dispatch(train_clear_error());
  dispatch(train_get_trained_list({ loading: true }));
  const resdata = await fetch(TRAIN_LIST_API, requestOptions)
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
    dispatch(train_get_trained_list(resdata));
  }
};
