import * as authActions from "../actions/auth";
import { api_route } from "../constants/Api";

const options = {
  credentials: "include",
  mode: "cors",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "application/json",
    "Access-Control-Allow-Headers": "*",
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
  const resdata = await fetch(api_route + "login", requestOptions)
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
  const resdata = await fetch(api_route + "logout", requestOptions)
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
      else dispatch(authActions.auth_error(error));
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
  const resdata = await fetch(api_route + "register", requestOptions)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 201 || status === 200) {
        return data.message;
      }
      throw data;
    })
    .catch((error) => {
      if (status === 401) dispatch(authActions.auth_logout_user());
      else dispatch(authActions.auth_error(error));
      return null;
    });
  if (status === 200) {
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
  const resdata = await fetch(api_route + "reset_password", requestOptions)
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
  const { token, password } = x;
  requestOptions = {
    ...options,
    body: JSON.stringify({ password }),
  };
  let status = 0;
  dispatch(authActions.auth_clear_error());
  dispatch(authActions.auth_set_loading(true));
  const resdata = await fetch(
    api_route + "reset_password_confirm/" + token,
    requestOptions
  )
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
      else dispatch(authActions.auth_error(error));
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
  const resdata = await fetch(api_route + "profile", requestOptions)
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
      else dispatch(authActions.auth_error("" && error));
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
  const resdata = await fetch(api_route + "change_password", requestOptions)
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
