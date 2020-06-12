import React, { useReducer, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as R from 'ramda'

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { MultipleSelect } from "components/ui/MultipleSelect";

import { ingredientActions } from "store/ingredient/actions";
import { getItems } from "store/ingredient/selectors";

import { recipeCreateReducer, initialState } from "./reducer";

import "./styles.css";

export const RecipeCreate = () => {
  const reduxDispatch = useDispatch()

  const [data, dispatch] = useReducer(recipeCreateReducer, initialState);

  const ingredientItems = useSelector(getItems)

  useEffect(() => {
    reduxDispatch(ingredientActions.getItems({ name: data.search.ingredient }))
  }, [reduxDispatch, data.search.ingredient])

  const hadleChangeInput = useCallback(({ target: { name, value } }) => {
    dispatch({ type: "change-data", payload: { field: name, value } });
  }, []);

  const handleSearchIngredients = useCallback(value => {
    dispatch({ type: 'change-search-field', payload: { field: 'ingredient', value }})
  }, [])

  const handleChangeIngredients = useCallback(value => {
    dispatch({ type: "ingredients-add", payload: value})
  }, [])

  return (
    <Container
      component={Paper}
      maxWidth="xl"
      elevation={3}
      className="recipe-create-container"
    >
      <form className="auth-content-form" onSubmit={() => null}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Имя"
          name="name"
          autoFocus
          value={data.name}
          onChange={hadleChangeInput}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="photo"
          label="Фото"
          value={data.photo}
          onChange={hadleChangeInput}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="complexity"
          label="Сложность"
          type="number"
          inputProps={{
            max: 10,
            min: 1,
          }}
          value={data.complexity}
          onChange={hadleChangeInput}
        />
        <MultipleSelect
          label="Ингредиенты"
          withSearchInput
          items={R.values(ingredientItems)}
          onSearch={handleSearchIngredients}
          value={data.ingredients}
          keyValue="id"
          onChange={handleChangeIngredients }
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="auth-content-submit-button"
        >
          Создать
        </Button>
      </form>
    </Container>
  );
};
