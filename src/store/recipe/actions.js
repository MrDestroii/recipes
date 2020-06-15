import { recipeTypes } from "./types";

export const recipeActions = {
  getItems: (query) => ({
    type: recipeTypes.RECIPE_GET_ITEMS,
    payload: query
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
    payload: id,
  }),
  getItemSuccess: (data) => ({
    type: recipeTypes.RECIPE_GET_ITEM_SUCCESS,
    payload: data,
  }),
  getItemFailure: (error) => ({
    type: recipeTypes.RECIPE_GET_ITEM_FAILURE,
    payload: error,
  }),
  changeLike: (userId, recipeId) => ({
    type: recipeTypes.CHANGE_LIKE_ITEM,
    payload: { userId, recipeId },
  }),
  changeLikeSuccess: (data) => ({
    type: recipeTypes.CHANGE_LIKE_ITEM_SUCCESS,
    payload: data,
  }),
  changeLikeFailure: (error) => ({
    type: recipeTypes.CHANGE_LIKE_ITEM_FAILURE,
    payload: error,
  }),
  create: (data) => ({
    type: recipeTypes.RECIPE_CREATE,
    payload: data,
  }),
  createSuccess: (data) => ({
    type: recipeTypes.RECIPE_CREATE_SUCCESS,
    payload: data,
  }),
  createFailure: (error) => ({
    type: recipeTypes.RECIPE_CREATE_FAILURE,
    payload: error,
  }),
};
