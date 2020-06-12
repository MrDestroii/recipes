import * as R from 'ramda'

import { ingredientTypes } from "./types";

const initialState = {
  items: {},
};

export const ingredientReducer = (state = initialState, action) => {
  switch (action.type) {

    case ingredientTypes.INGREDIENT_GET_ITEMS_SUCCESS: {
      const items = R.indexBy(R.prop("id"))(action.payload)
      return {
        ...state,
        items
      }
    }

    default:
      return state;
  }
};
