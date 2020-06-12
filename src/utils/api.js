import axios from "axios";
import * as R from "ramda";

import { oneInspectTrue } from "helpers/tools";
import { store } from "store/index";

import { authActions } from "store/auth/actions";
import { getIsLogged } from "store/auth/selectors";

import { storage } from "./storage";

const apiUrl = process.env.REACT_APP_API_URL;

const basic = (url, method, data, params) => {
  const accessTokenStorage = storage("accessToken");

  const headers = {};
  const hasAuthorizationToken = accessTokenStorage.has();

  if (hasAuthorizationToken) {
    headers.Authorization = `Bearer ${accessTokenStorage.get()}`;
  }

  return axios
    .create({
      baseURL: apiUrl,
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
      },
    })({
      headers,
      method,
      url,
      data,
      params,
    })
    .then((response) => response.data)
    .catch((e) => {
      const isUnauthorized = R.compose(
        R.equals(401),
        R.path(["response", "data", "statusCode"])
      )(e);

      if (isUnauthorized) {
        const isLogged = getIsLogged(store.getState());
        isLogged && store.dispatch(authActions.logout());
      }

      throw e;
    });
};

export const api = {
  service(serviceName) {
    if (
      oneInspectTrue(
        [R.isNil, R.isEmpty, R.compose(R.not, R.is(String))],
        serviceName
      )
    ) {
      throw new Error("api utils - service incorrect");
    } else {
      return {
        get: (id) => basic(`${serviceName}/${id}`, "get", null),
        create: (body) => basic(serviceName, "post", body),
        find: (query) => basic(serviceName, "get", null, query),
        remove: (id) => basic(serviceName, "delete", null, { id }),
        update: (id, body) => basic(serviceName, "put", body, { id }),
      };
    }
  },
  auth: {
    getProfile: () => basic("/auth/profile", "get"),
    login: (body) => basic("/auth/signin", "post", body),
  },
};
