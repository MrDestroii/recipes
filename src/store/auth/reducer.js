import { storage } from "utils/storage";

import { authTypes } from "./types";

const initialState = {
  isLogged: storage("accessToken").has(),
  profile: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {

    case authTypes.AUTH_SIGN_IN_SUCCESS: {
      return {
        ...state,
        profile: action.payload,
        isLogged: true
      }
    }

    case authTypes.AUTH_LOGOUT: {
      return {
        ...initialState,
        isLogged: false
      }
    }

    case authTypes.AUTH_GET_PROFILE_SUCCESS: {
      return {
        ...state,
        profile: action.payload
      }
    }

    default:
      return state;
  }
};
