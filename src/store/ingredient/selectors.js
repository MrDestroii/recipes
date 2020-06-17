import { createSelector } from "reselect";

import * as R from "ramda";

const getState = R.prop("ingredient");

export const getItems = createSelector(getState, R.propOr({}, "items"));
