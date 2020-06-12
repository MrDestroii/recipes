import React, { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";

import { Auth } from "components/auth/Auth";
import { AuthButton } from "components/auth/AuthButton";
import { RecipesList } from "components/recipes/List";
import { RecipeInfo } from "components/recipes/Info";
import { NotFound } from "components/ui/NotFound";

import { renderNotify } from "utils/notify";

import { routerActions } from "store/router/actions";
import { authActions } from "store/auth/actions";
import { getIsLogged, profileIsNull } from "store/auth/selectors";
import { compareLocations } from "store/router/selectors";

import "./styles.css";

export const App = () => {
  const dispatch = useDispatch();

  const isAuthPage = useSelector(compareLocations("/auth"));
  const isLogged = useSelector(getIsLogged);
  const isProfileNull = useSelector(profileIsNull);

  const handleClickAuthButton = useCallback(() => {
    if (isLogged) {
      dispatch(authActions.logout());
    } else {
      dispatch(routerActions.push("/auth"));
    }
  }, [dispatch, isLogged]);

  useEffect(() => {
    if (isLogged && isProfileNull) {
      dispatch(authActions.getProfile());
    }
  }, [isProfileNull, isLogged, dispatch]);

  const renderAuth = useCallback(() => {
    if (isLogged && isAuthPage) {
      dispatch(routerActions.push("/"));

      renderNotify({
        title: "You are Logged",
        text: "You are logged in",
      });
    } else {
      return <Auth />;
    }
  }, [dispatch, isLogged, isAuthPage]);

  const rendererAuthButton = useMemo(() => {
    return (
      !isAuthPage && (
        <AuthButton isLogged={isLogged} onClick={handleClickAuthButton} />
      )
    );
  }, [isAuthPage, isLogged, handleClickAuthButton]);

  return (
    <div className="app">
      {rendererAuthButton}
      <Switch>
        <Route exact path="/" component={RecipesList} />
        <Route path="/auth" render={renderAuth} />
        <Route exact path="/recipe/:id" component={RecipeInfo} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};
