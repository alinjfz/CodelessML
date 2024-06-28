// MAIN ROUTE
export const API_ROUTE_PREFIX = "http://127.0.0.1:5000/";
export const API_ROUTE = API_ROUTE_PREFIX + "api/";

// PREFIX
export const AUTH_PREFIX = "auth/";

// AUTH
export const AUTH_LOGIN_API = API_ROUTE + AUTH_PREFIX + "login";
export const AUTH_LOGOUT_API = API_ROUTE + AUTH_PREFIX + "logout";
export const AUTH_REGISTER_API = API_ROUTE + AUTH_PREFIX + "register";
export const AUTH_RESET_PASS_API = API_ROUTE + AUTH_PREFIX + "reset_password";
export const AUTH_RESET_PASS_CONFIRM_API =
  API_ROUTE + AUTH_PREFIX + "reset_password_confirm";
export const AUTH_PROFILE_API = API_ROUTE + AUTH_PREFIX + "profile";
export const AUTH_CHANGE_PASS_API = API_ROUTE + AUTH_PREFIX + "change_password";
export const AUTH_VERIFY_EMAIL_API = API_ROUTE + AUTH_PREFIX + "verify_email";
export const AUTH_SEND_VERIFICATION_API =
  API_ROUTE + AUTH_PREFIX + "send_verification";

// TEST
export const TEST_PRIVATE_API = API_ROUTE + "test";
export const TEST_GENERAL_API = API_ROUTE + "privatetest";
