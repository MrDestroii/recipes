import { takeEvery, call, put } from "redux-saga/effects";

import { renderNotify } from "utils/notify";
import { api } from "utils/api";

import { getErrorMessage } from "helpers/tools";

import { ingredientActions } from "./actions";
import { ingredientTypes } from "./types";

function* getItems(action) {
  try {
    const result = yield call(api.service("ingredient").find, action.payload);

    yield put(ingredientActions.getItemsSuccess(result));
  } catch (error) {
    renderNotify({
      title: "Error get ingredients",
      text: getErrorMessage("Error get ingredients")(error),
    });
    yield put(ingredientActions.getItemsFailure(error));
  }
}

function* create(action) {
  try {
    const data = action.payload;
    const result = yield call(api.service("ingredient").create, data);

    yield put(ingredientActions.createSuccess(result));
  } catch (error) {
    renderNotify({
      title: "Error create ingredient",
      text: getErrorMessage("Error create ingredient")(error),
    });
    yield put(ingredientActions.createFailure(error));
  }
}

export function* ingredientSaga() {
  yield takeEvery(ingredientTypes.INGREDIENT_GET_ITEMS, getItems);
  yield takeEvery(ingredientTypes.INGREDIENT_CREATE, create);
}
