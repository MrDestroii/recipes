import types from "./types";

export const push = (path, state) => ({
  type: types.PUSH,
  payload: {
    path,
    state,
  },
});
