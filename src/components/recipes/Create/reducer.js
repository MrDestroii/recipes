export const initialState = {
  name: "",
  photo: "",
  complexity: 1,
  ingredients: [],
  description: "",
  steps: [],
  alternativeIngredients: {},
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
  ingredientsAdd: (data) => ({
    type: "ingredients-add",
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

    case "ingredients-add": {
      return {
        ...state,
        ingredients: action.payload,
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
