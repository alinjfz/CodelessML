import * as authActions from "../actions/auth";
import {
  AUTH_CHANGE_PASS_API,
  AUTH_LOGIN_API,
  AUTH_LOGOUT_API,
  AUTH_PROFILE_API,
  AUTH_REGISTER_API,
  AUTH_RESET_PASS_API,
  AUTH_RESET_PASS_CONFIRM_API,
  AUTH_VERIFY_EMAIL_API,
  AUTH_SEND_VERIFICATION_API,
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
//DONE
export const api_login = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_LOGIN_API, requestOptions)
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
      dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_login_user(resdata));
  }
};
//DONE
export const api_logout = () => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    method: "GET",
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_LOGOUT_API, requestOptions)
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
      if (status === 401) dispatch(authActions.auth_logout_user());
      if (String(error).startsWith("TypeError: Failed to fetch")) {
        dispatch(authActions.auth_error("error"));
        return;
      } else dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_logout_user(resdata));
  }
};
//DONE
export const api_register = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_REGISTER_API, requestOptions)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 201 || status === 200) {
        return data;
      }
      throw data;
    })
    .catch((error) => {
      if (status === 401) dispatch(authActions.auth_logout_user());
      if (String(error).startsWith("TypeError: Failed to fetch")) {
        dispatch(authActions.auth_error("error"));
        return;
      } else dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 201) {
    dispatch(authActions.auth_register_user(resdata));
  }
};
//DONE
export const api_send_reset_pass = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_RESET_PASS_API, requestOptions)
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
      dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_reset_password(resdata));
  }
};
//DONE
export const api_confirm_reset_pass = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_RESET_PASS_CONFIRM_API, requestOptions)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 201 || status === 200) {
        return data;
      }
      throw data;
    })
    .catch((error) => {
      if (status === 401) dispatch(authActions.auth_logout_user());
      if (String(error).startsWith("TypeError: Failed to fetch")) {
        dispatch(authActions.auth_error("error"));
        return;
      } else dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_confirm_reset_password(resdata));
  }
};
//DONE
export const api_get_profile = () => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    method: "GET",
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_PROFILE_API, requestOptions)
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
        dispatch(authActions.auth_error("error"));
        return;
      } else dispatch(authActions.auth_error("" && error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_get_profile(resdata));
  }
};
//DONE
export const api_change_pass = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_CHANGE_PASS_API, requestOptions)
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
      dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_change_password(resdata));
  }
};
//
export const api_verify_email = (x) => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
    body: JSON.stringify(x),
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_VERIFY_EMAIL_API, requestOptions)
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
      dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_verify_email(resdata));
  }
};
//DONE
export const api_send_verification = () => async (dispatch, getstate) => {
  requestOptions = {
    ...options,
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(AUTH_SEND_VERIFICATION_API, requestOptions)
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
      dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
    dispatch(authActions.auth_send_verification(resdata));
  }
};
