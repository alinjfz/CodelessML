// MAIN ROUTE
export const API_ROUTE_PREFIX = "http://127.0.0.1:5000/";
export const API_ROUTE = API_ROUTE_PREFIX + "api/";

// PREFIX
export const AUTH_PREFIX = "auth/";
export const ALGORITHM_PREFIX = "algorithm/";
export const TRAIN_PREFIX = "train/";
export const UPLOAD_PREFIX = "uploader/";
export const SUGGEST_PREFIX = "suggest/";
export const PREDICT_PREFIX = "predict/";
export const DOWNLOAD_PREFIX = "download/";

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

// ALGORITHM
export const ALGORITHM_LIST_API =
  API_ROUTE + ALGORITHM_PREFIX + ALGORITHM_PREFIX + "";

// TRAIN
export const TRAIN_API = API_ROUTE + TRAIN_PREFIX;
export const TRAIN_LIST_API = API_ROUTE + TRAIN_PREFIX;

// UPLOAD
export const UPLOAD_DATA_API = API_ROUTE + UPLOAD_PREFIX + "upload";
export const UPLOADED_LIST_API = API_ROUTE + UPLOAD_PREFIX + "";
export const ANALYSIS_DATASET_API = API_ROUTE + UPLOAD_PREFIX + "analysis";

// SUGGEST
export const SUGGEST_ALGO_API =
  API_ROUTE + SUGGEST_PREFIX + "suggest_algorithm";

// PREDICT
export const PREDICT_DATA_API = API_ROUTE + PREDICT_PREFIX;
