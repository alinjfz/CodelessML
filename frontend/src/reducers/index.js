import auth from "./auth";
import train from "./train";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth,
  train,
});

export default rootReducer;
