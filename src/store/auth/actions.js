import { authTypes } from "./types";

export const authActions = {
  signIn: (data) => ({
    type: authTypes.AUTH_SIGN_IN,
    payload: data,
  }),
  signInSuccess: (user) => ({
    type: authTypes.AUTH_SIGN_IN_SUCCESS,
    payload: user,
  }),
  signInFailure: (error) => ({
    type: authTypes.AUTH_SIGN_IN_FAILURE,
    payload: error,
  }),
  logout: () => ({
    type: authTypes.AUTH_LOGOUT,
  }),
  getProfile: () => ({
    type: authTypes.AUTH_GET_PROFILE,
  }),
  getProfileSuccess: (user) => ({
    type: authTypes.AUTH_GET_PROFILE_SUCCESS,
    payload: user,
  }),
  getProfileFaulure: () => ({
    type: authTypes.AUTH_GET_PROFILE_FAILURE,
  }),
};
