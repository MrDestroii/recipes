import { getAlternativeIngredients } from "helpers/tools";

export const initialRecipeInfoData = {
  name: "",
  photo: "",
  complexity: 1,
  ingredients: [],
  description: "",
  steps: [],
  alternativeIngredients: {},
};

export const initialState = {
  search: {
    ingredient: "",
  },
};

export const actions = {
  changeSearch: (value) => ({
    type: "change-search-field",
    payload: { field: "ingredient", value },
  }),
  changeData: (field, value) => ({
    type: "change-data",
    payload: { field, value },
  }),
  ingredientsChange: (data) => ({
    type: "ingredients-cahnge",
    payload: data,
  }),
  alternativeIngredientsChange: (ingredientId, value) => ({
    type: "alternative-ingredients-change",
    payload: { ingredientId, value },
  }),
};

export const recipeCreateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "change-data": {
      const { field, value } = action.payload;
      return {
        ...state,
        [field]: value,
      };
    }

    case "change-search-field": {
      const { field, value } = action.payload;
      return {
        ...state,
        search: {
          ...state.search,
          [field]: value,
        },
      };
    }

    case "ingredients-cahnge": {
      const alternativeIngredients = getAlternativeIngredients(state.alternativeIngredients)(action.payload);
      
      return {
        ...state,
        ingredients: action.payload,
        alternativeIngredients,
      };
    }

    case "alternative-ingredients-change": {
      const { ingredientId, value } = action.payload;
      return {
        ...state,
        alternativeIngredients: {
          ...state.alternativeIngredients,
          [ingredientId]: value,
        },
      };
    }

    default:
      return state;
  }
};
