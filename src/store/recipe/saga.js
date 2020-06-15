import { takeEvery, put, call } from "redux-saga/effects";

import * as R from "ramda";

import { getErrorMessage } from "helpers/tools";

import { api } from "utils/api";
import { renderNotify } from "utils/notify";

import { routerActions } from "store/router/actions";

import { recipeActions } from "./actions";
import { recipeTypes } from "./types";

function* getItems(action) {
  try {
    const query = action.payload
    const result = yield call(api.service("recipe").find, query);
    yield put(recipeActions.getItemsSuccess(result));
  } catch (error) {
    renderNotify({
      title: "Error get recipes",
      text: getErrorMessage("Error get recipes")(error),
    });
    yield put(recipeActions.getItemsFailure(error));
  }
}

function* getItem(action) {
  try {
    const result = yield call(api.service("recipe").get, action.payload);

    yield put(recipeActions.getItemSuccess(result));
  } catch (error) {
    renderNotify({
      title: "Error get recipe",
      text: getErrorMessage("Error get recipe")(error),
    });
    yield put(recipeActions.getItemFailure(error));
  }
}

function* changeLike(action) {
  try {
    const { userId, recipeId } = action.payload;

    if (R.isNil(userId)) {
      renderNotify({
        title: "Вы не авторизованы",
        text: "Что бы ставить лайки рецептам, необходисо авторизоваться",
      });
    } else {
      const result = yield call(api.service("like").create, {
        userId,
        recipeId,
      });
      yield put(recipeActions.changeLikeSuccess(result));
    }
  } catch (error) {
    renderNotify({
      title: "Error change Like",
      text: getErrorMessage("Error change Like")(error),
    });
    yield put(recipeActions.changeLikeFailure(error));
  }
}

function* create(action) {
  try {
    const data = action.payload;

    yield call(api.service("recipe").create, data);

    yield put(routerActions.push("/"));
  } catch (error) {
    renderNotify({
      title: "Error create Recipe",
      text: getErrorMessage("Error create Recipe")(error),
    });
    yield put(recipeActions.createFailure(error));
  }
}

export function* recipeSaga() {
  yield takeEvery(recipeTypes.RECIPE_GET_ITEMS, getItems);
  yield takeEvery(recipeTypes.RECIPE_GET_ITEM, getItem);
  yield takeEvery(recipeTypes.CHANGE_LIKE_ITEM, changeLike);
  yield takeEvery(recipeTypes.RECIPE_CREATE, create);
}
