import {
  TRAIN_ERROR,
  TRAIN_CLEAR_ERROR,
  TRAIN_IN_PROGRESS,
  TRAIN_UPLOADING,
  TRAIN_LOADING_LIST,
  TRAIN_SET_DATA,
  TRAIN_RESET_DATA,
  TRAIN_GET_TRAINED_LIST,
  TRAIN_GET_ALGO_LIST,
} from "../constants/Train";

const initialState = {
  algo_list: [],
  trained_list: [],
  new_model: {},
  error: {},
  uploading: false,
  training: false,
  loading: false,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case TRAIN_RESET_DATA:
      return { ...initialState };
    case TRAIN_ERROR:
      return { ...state, error: action.x };
    case TRAIN_CLEAR_ERROR:
      return { ...state, error: {} };
    case TRAIN_IN_PROGRESS:
      return { ...state, training: action.x };
    case TRAIN_UPLOADING:
      return { ...state, uploading: action.x };
    case TRAIN_LOADING_LIST:
      return { ...state, loading: action.x };
    case TRAIN_GET_TRAINED_LIST:
      return { ...state, loading: false, trained_list: action.x };
    case TRAIN_GET_ALGO_LIST:
      return { ...state, loading: false, algo_list: action.x };
    case TRAIN_SET_DATA:
      return { ...state, new_model: action.x };
    default:
      return state;
  }
}
