import {
  TRAIN_ERROR,
  TRAIN_CLEAR_ERROR,
  TRAIN_LOADING_LIST,
  TRAIN_SET_DATA,
  TRAIN_RESET_DATA,
  TRAIN_GET_TRAINED_LIST,
  TRAIN_GET_ALGO_LIST,
  TRAIN_UPLOAD_DATA,
  TRAIN_CLEAR_NEW_MODEL,
  TRAIN_SET_NEW_MODEL,
  TRAIN_UPLOAD_LIST,
  TRAIN_SUGGEST_ALGO,
  TRAIN_DATASET_ANALYSIS,
  TRAIN_PREDICT_DATA,
} from "../constants/Train";

const initialState = {
  algo_list: [],
  train_list: [],
  new_model: {
    dataset_id: "",
    dataset: {},
    target_column: "",
    feature_columns: [],
    progress: 0,
    train_algo_name: "",
    trained: {},
  },
  upload_list: [],
  suggestion_list: [],
  predict: {
    train_id: "",
    user_data: {},
    prediction: false,
  },
  error: "",
  message: "",
  uploading: false,
  training: false,
  loading: false,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case TRAIN_RESET_DATA:
      return { ...initialState };
    case TRAIN_ERROR:
      if (action.x) {
        if (action.x.error) return { ...state, loading: false, ...action.x };
      }
      return { ...state, loading: false, error: "error" };
    case TRAIN_PREDICT_DATA:
      if (action.x && action.x.loading) return { ...state, loading: true };
      const prev_predict = state.predict;
      const predict_msg = (action.x && action.x.message) || "";
      delete action.x["message"];
      return {
        ...state,
        loading: false,
        message: predict_msg,
        predict: { ...prev_predict, ...action.x },
      };
    case TRAIN_CLEAR_ERROR:
      return { ...state, error: "", message: "" };
    case TRAIN_CLEAR_NEW_MODEL:
      return {
        ...state,
        error: "",
        message: "",
        loading: false,
        uploading: false,
        training: false,
        upload_list: [],
        new_model: { ...initialState.new_model },
      };
    case TRAIN_UPLOAD_DATA:
      return { ...state, uploading: false, ...action.x };
    case TRAIN_UPLOAD_LIST:
      return { ...state, uploading: false, ...action.x };
    case TRAIN_DATASET_ANALYSIS:
      if (action.x && action.x.loading) return { ...state, loading: true };
      const analys_prev = { ...state.new_model };
      return {
        ...state,
        loading: false,
        new_model: { ...analys_prev, ...action.x },
      };
    case TRAIN_SUGGEST_ALGO:
      if (action.x && action.x.loading) return { ...state, loading: true };
      const prev_suggest = { ...state.new_model };
      return {
        ...state,
        loading: false,
        new_model: { ...prev_suggest, ...action.x },
      };
    case TRAIN_LOADING_LIST:
      return { ...state, loading: action.x };
    case TRAIN_GET_TRAINED_LIST:
      if (action.x && action.x.loading) {
        return { ...state, loading: true };
      }
      return { ...state, loading: false, ...action.x };
    case TRAIN_GET_ALGO_LIST:
      return { ...state, loading: false, algo_list: action.x };
    case TRAIN_SET_NEW_MODEL:
      const prev_model = { ...state.new_model };
      return {
        ...state,
        new_model: {
          ...prev_model,
          ...action.x,
        },
      };
    case TRAIN_SET_DATA:
      if (action.x && action.x.loading) return { ...state, loading: true };
      const prev_set_data = { ...state.new_model };
      const train_msg = (action.x && action.x.message) || "";
      delete action.x["message"];
      return {
        ...state,
        loading: false,
        message: train_msg,
        new_model: { ...prev_set_data, trained: { ...action.x } },
      };
    default:
      return state;
  }
}
