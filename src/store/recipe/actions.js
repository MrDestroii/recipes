import { recipeTypes } from "./types";

export const recipeActions = {
  getItems: () => ({
    type: recipeTypes.RECIPE_GET_ITEMS,
  }),
  getItemsSuccess: (data) => ({
    type: recipeTypes.RECIPE_GET_ITEMS_SUCCESS,
    payload: data,
  }),
  getItemsFailure: (error) => ({
    type: recipeTypes.RECIPE_GET_ITEMS_FAILURE,
    payload: error,
  }),
};
