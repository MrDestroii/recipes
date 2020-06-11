import { takeEvery, put, call } from "redux-saga/effects";
import { recipeActions } from "./actions";
import { recipeTypes } from "./types";
import { api } from "utils/api";

function* getItems(action) {
  try {
    const result = yield call(api.service("recipe").find, {});
    yield put(recipeActions.getItemsSuccess(result))
  } catch (error) {
    yield put(recipeActions.getItemsFailure(error));
  }
}

export function* recipeSaga() {
  yield takeEvery(recipeTypes.RECIPE_GET_ITEMS, getItems);
}
