import { takeEvery, put, call } from "redux-saga/effects";

import * as R from "ramda";

import { api } from "utils/api";
import { storage } from "utils/storage";
import { renderNotify } from "utils/notify";

import { authActions } from "./actions";
import { authTypes } from "./types";

function* signIn(action) {
  try {
    const result = yield call(api.auth.login, action.payload);

    storage("accessToken").set(result.accessToken);

    yield put(authActions.signInSuccess(result.user));
  } catch (error) {
    renderNotify({
      title: "Error Sign In",
      text: R.pathOr("Error Sign In", ["response", "data", "message"], error),
    });
    yield put(authActions.signInFailure(error));
  }
}

function* logout() {
  yield call(storage("accessToken").remove);
}

function* getProfile() {
  try {
    const result = yield call(api.auth.getProfile);

    yield put(authActions.getProfileSuccess(result));
  } catch (error) {
    renderNotify({
      title: "Error Get Profile",
      text: R.pathOr(
        "Get profile error",
        ["response", "data", "message"],
        error
      ),
    });
    yield put(authActions.getProfileFaulure(error));
  }
}

export function* authSaga() {
  yield takeEvery(authTypes.AUTH_SIGN_IN, signIn);
  yield takeEvery(authTypes.AUTH_LOGOUT, logout);
  yield takeEvery(authTypes.AUTH_GET_PROFILE, getProfile);
}
