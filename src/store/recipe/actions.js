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
  getItem: (id) => ({
    type: recipeTypes.RECIPE_GET_ITEM,
    payload: id
  }),
  getItemSuccess: (data) => ({
    type: recipeTypes.RECIPE_GET_ITEM_SUCCESS,
    payload: data,
  }),
  getItemFailure: (error) => ({
    type: recipeTypes.RECIPE_GET_ITEM_FAILURE,
    payload: error,
  }),
};
