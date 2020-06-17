import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as R from "ramda";

import { Container, Paper } from "@material-ui/core";

import { RecipeForm } from "components/recipes/Form";

import { getAlternativeIngredients } from "helpers/tools";

import { recipeActions } from "store/recipe/actions";
import { getItem } from "store/recipe/selectors";
import { getProfileId } from "store/auth/selectors";
import { Redirect } from "react-router-dom";

export const RecipeEdit = (props) => {
  const { id } = props;

  const dispatch = useDispatch();

  const recipeInfo = useSelector(getItem(id));
  const userId = useSelector(getProfileId);
  const isCurrentUserRecipe = useMemo(
    () => R.compose(R.equals(userId), R.path(["user", "id"]))(recipeInfo),
    [userId, recipeInfo]
  );

  useEffect(() => {
    dispatch(recipeActions.getItem(id));
  }, [dispatch, id]);

  const handleOnSubmit = useCallback(
    (data) => {
      dispatch(recipeActions.update(id, data));
    },
    [id, dispatch]
  );

  const rendererContent = useMemo(() => {
    const isNilRecipeInfo = R.isNil(recipeInfo);
    if (isNilRecipeInfo) {
      return <div>Not Found</div>;
    } else {
      const alternativeIngredients = R.compose(
        (result) => {
          return getAlternativeIngredients(result)(recipeInfo.ingredients);
        },
        R.mapObjIndexed(R.map(R.prop("ingredientAlternative"))),
        R.groupBy(R.path(["ingredient", "id"])),
        R.prop("alternativeIngredients")
      )(recipeInfo);

      return isCurrentUserRecipe ? (
        <RecipeForm
          isEdit
          initialData={{ ...recipeInfo, alternativeIngredients }}
          onSubmit={handleOnSubmit}
        />
      ) : (
        <Redirect to="/" />
      );
    }
  }, [recipeInfo, handleOnSubmit, isCurrentUserRecipe]);

  return (
    <Container component={Paper} maxWidth="xl" elevation={3}>
      {rendererContent}
    </Container>
  );
};
