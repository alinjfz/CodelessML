import * as authActions from "../actions/auth";
import { TRAIN__API } from "../constants/ApiRoutes";
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
