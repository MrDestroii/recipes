import * as R from "ramda";

import { recipeTypes } from "./types";

const initialState = {
  items: {},
};

export const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case recipeTypes.RECIPE_GET_ITEMS_SUCCESS: {
      const items = R.indexBy(R.prop("id"))(action.payload);
      return {
        ...state,
        items,
      };
    }

    case recipeTypes.RECIPE_GET_ITEM_SUCCESS: {
      const item = action.payload;
      return {
        ...state,
        items: {
          ...state.items,
          [item.id]: {
            ...item,
          },
        },
      };
    }

    default:
      return state;
  }
};
