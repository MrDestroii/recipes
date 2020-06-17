import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Container, Paper } from "@material-ui/core";

import { RecipeForm } from "components/recipes/Form";

import { recipeActions } from "store/recipe/actions";

import "./styles.css";

export const RecipeCreate = () => {
  const reduxDispatch = useDispatch();

  const handleOnSubmit = useCallback(
    (data) => {
      reduxDispatch(recipeActions.create(data));
    },
    [reduxDispatch]
  );

  return (
    <Container
      component={Paper}
      maxWidth="xl"
      elevation={3}
      className="recipe-create-container"
    >
      <RecipeForm onSubmit={handleOnSubmit} />
    </Container>
  );
};
