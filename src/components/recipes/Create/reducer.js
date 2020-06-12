export const initialState = {
  name: "",
  photo: "",
  complexity: 1,
  ingredients: [],
  search: {
    ingredient: ''
  }
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
          [field]: value
        }
      }
    }

    case "ingredients-add": {
      return {
        ...state,
        ingredients: action.payload
      }
    }

    default:
      return state;
  }
};
