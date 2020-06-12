import { ingredientTypes } from "./types";

export const ingredientActions = {
  getItems: (query) => ({
    type: ingredientTypes.INGREDIENT_GET_ITEMS,
    payload: query,
  }),
  getItemsSuccess: (data) => ({
    type: ingredientTypes.INGREDIENT_GET_ITEMS_SUCCESS,
    payload: data,
  }),
  getItemsFailure: (error) => ({
    type: ingredientTypes.INGREDIENT_GET_ITEMS_FAILURE,
    payload: error,
  }),
};
