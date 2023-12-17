import * as traintypes from "../constants/Train";
export const train_error = (x) => ({
  type: traintypes.TRAIN_ERROR,
  x,
});
export const train_clear_error = (x) => ({
  type: traintypes.TRAIN_CLEAR_ERROR,
  x,
});
export const train_reset_data = (x) => ({
  type: traintypes.TRAIN_RESET_DATA,
  x,
});
export const train_in_progress = (x) => ({
  type: traintypes.TRAIN_IN_PROGRESS,
  x,
});
export const train_uploading = (x) => ({
  type: traintypes.TRAIN_UPLOADING,
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
