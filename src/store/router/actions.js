import types from "./types";

export const routerActions = {
  push: (path, state) => ({
    type: types.PUSH,
    payload: {
      path,
      state,
    },
  })
}
