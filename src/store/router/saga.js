import { put, takeEvery } from "redux-saga/effects";
import { push } from "connected-react-router";

import types from "./types";

export function* routerPush(action) {
  const { path, state } = action.payload;
  yield put(push(path, state));
}

function* routerSaga() {
  yield takeEvery(types.PUSH, routerPush);
}

export default routerSaga;
