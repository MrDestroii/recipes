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

    case recipeTypes.CHANGE_LIKE_ITEM_SUCCESS: {
      const like = action.payload;

      const currentRecipe = R.prop(like.recipe.id, state.items);

      const isIncludeLike = R.compose(
        R.not,
        R.equals(-1),
        R.findIndex(R.propEq("id", like.id))
      );

      const newLikes = R.ifElse(
        isIncludeLike,
        R.filter(R.compose(R.not, R.equals(like.id), R.prop("id"))),
        R.concat([like])
      )(currentRecipe.likes);

      return {
        ...state,
        items: {
          ...state.items,
          [like.recipe.id]: {
            ...currentRecipe,
            likes: newLikes,
          },
        },
      };
    }

    default:
      return state;
  }
};
