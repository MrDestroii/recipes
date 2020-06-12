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

export function* ingredientSaga() {
  yield takeEvery(ingredientTypes.INGREDIENT_GET_ITEMS, getItems);
}
