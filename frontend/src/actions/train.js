import * as traintypes from "../constants/Train";
export const train_error = (x) => ({
  type: traintypes.TRAIN_ERROR,
  x,
});
export const train_clear_error = () => ({
  type: traintypes.TRAIN_CLEAR_ERROR,
});
export const train_reset_data = (x) => ({
  type: traintypes.TRAIN_RESET_DATA,
  x,
});
export const train_loading_list = (x) => ({
  type: traintypes.TRAIN_LOADING_LIST,
  x,
});
export const train_set_data = (x) => ({
  type: traintypes.TRAIN_SET_DATA,
  x,
});
export const train_get_trained_list = (x) => ({
  type: traintypes.TRAIN_GET_TRAINED_LIST,
  x,
});
export const train_get_algo_list = (x) => ({
  type: traintypes.TRAIN_GET_ALGO_LIST,
  x,
});
export const train_upload_data = (x) => ({
  type: traintypes.TRAIN_UPLOAD_DATA,
  x,
});
export const train_upload_list = (x) => ({
  type: traintypes.TRAIN_UPLOAD_LIST,
  x,
});
export const train_dataset_analysis = (x) => ({
  type: traintypes.TRAIN_DATASET_ANALYSIS,
  x,
});
export const train_set_new_model = (x) => ({
  type: traintypes.TRAIN_SET_NEW_MODEL,
  x,
});
export const train_suggest_algo = (x) => ({
  type: traintypes.TRAIN_SUGGEST_ALGO,
  x,
});
export const train_clear_new_model = (x) => ({
  type: traintypes.TRAIN_CLEAR_NEW_MODEL,
  x,
});
export const train_predict_data = (x) => ({
  type: traintypes.TRAIN_PREDICT_DATA,
  x,
});
