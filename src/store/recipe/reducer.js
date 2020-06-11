import * as R from "ramda";

import { recipeTypes } from "./types";

const initialState = {
  items: {},
};

export const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case recipeTypes.RECIPE_GET_ITEMS_SUCCESS: {
        console.log('sda')
      const items = R.indexBy(R.prop("id"))(action.payload);
      return {
        ...state,
        items,
      };
    }

    default:
      return state;
  }
};
