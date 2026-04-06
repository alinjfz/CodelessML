import * as authActions from "../actions/auth";
import {
  train_upload_data,
  train_upload_list,
  train_dataset_analysis,
  train_clear_error,
  train_error,
} from "../actions/train";
import {
  UPLOADED_LIST_API,
  UPLOAD_DATA_API,
  ANALYSIS_DATASET_API,
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

export const api_upload_data = (x) => async (dispatch, getstate) => {
  requestOptions = {
    credentials: "include",
    mode: "cors",
    method: "POST",
    // ...options,
    // "Content-Type": "multipart/form-data",
    // Accept: "application/json",
    // "Content-Type": "application/x-www-form-urlencoded",
    body: x,
  };
  let status = 0;
  dispatch(train_clear_error());
  dispatch(train_upload_data({ uploading: true }));
  const resdata = await fetch(UPLOAD_DATA_API, requestOptions)
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
    dispatch(train_upload_data(resdata));
  }
};
export const api_upload_list = () => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    method: "GET",
  };
  let status = 0;
  dispatch(train_clear_error());
  dispatch(train_upload_list({ uploading: true }));
  const resdata = await fetch(UPLOADED_LIST_API, requestOptions)
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
      return;
    });
  if (status === 200) {
    dispatch(train_upload_list(resdata));
  }
};
export const api_analysis_dataset = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(train_clear_error());
  dispatch(train_dataset_analysis({ loading: true }));
  const resdata = await fetch(ANALYSIS_DATASET_API, requestOptions)
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
      // console.log(error, "error");
      dispatch(train_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(train_dataset_analysis(resdata));
  }
};
