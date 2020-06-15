import React, { useReducer, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as R from "ramda";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { ingredientActions } from "store/ingredient/actions";
import { getItems } from "store/ingredient/selectors";
import { recipeActions } from "store/recipe/actions";

import { recipeCreateReducer, initialState, actions } from "./reducer";

import "./styles.css";
import { renderNotify } from "utils/notify";
import { Select } from "components/ui/Select";

export const RecipeCreate = () => {
  const reduxDispatch = useDispatch();
  const [data, dispatch] = useReducer(recipeCreateReducer, initialState);

  const ingredientItems = useSelector(getItems);

  const isNotEmptyDataIngredients = useMemo(
    () => R.compose(R.not, R.isEmpty)(data.ingredients),
    [data.ingredients]
  );

  useEffect(() => {
    reduxDispatch(ingredientActions.getItems({ name: data.search.ingredient }));
  }, [reduxDispatch, data.search.ingredient]);

  const hadleChangeInput = useCallback(({ target: { name, value } }) => {
    dispatch(actions.changeData(name, value));
  }, []);

  const handleSearchIngredients = useCallback((value) => {
    dispatch(actions.changeSearch(value));
  }, []);

  const handleChangeIngredients = useCallback((value) => {
    dispatch(actions.ingredientsAdd(value));
  }, []);

  const handleChangeAlternativeIngredients = useCallback(
    (ingredientId) => (value) => {
      dispatch(actions.alternativeIngredientsChange(ingredientId, value));
    },
    []
  );

  const handleonSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isNotEmptyDataIngredients) {
        reduxDispatch(
          recipeActions.create({
            name: data.name,
            photo: data.photo,
            complexity: data.complexity,
            ingredients: data.ingredients,
            alternativeIngredients: data.alternativeIngredients,
            description: data.description,
          })
        );
      } else {
        renderNotify({
          title: "Error",
          text: "Необходимо добавить минимум один ингредиент",
        });
      }
    },
    [reduxDispatch, data, isNotEmptyDataIngredients]
  );

  const handleCreateIngredient = useCallback(
    (name) => () => {
      reduxDispatch(ingredientActions.create({ name }));
    },
    [reduxDispatch]
  );

  const rendererCreateIngredient = useCallback(
    (valueSearch) => {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateIngredient(valueSearch)}
        >
          Создать Ингредиент
        </Button>
      );
    },
    [handleCreateIngredient]
  );

  const rendererAlternativeIngredients = useMemo(() => {
    return (
      isNotEmptyDataIngredients && (
        <div>
          <span>Альтернативные ингредиенты</span>
          {R.map((ingredient) => {
            return (
              <Select
                key={ingredient.id}
                items={R.values(ingredientItems)}
                onChange={handleChangeAlternativeIngredients(ingredient.id)}
                withSearch
                onSearch={handleSearchIngredients}
                multiple
                renderSearchContentEmptyItems={rendererCreateIngredient}
                label={ingredient.name}
              />
            );
          })(data.ingredients)}
        </div>
      )
    );
  }, [
    data,
    ingredientItems,
    handleSearchIngredients,
    handleChangeAlternativeIngredients,
    rendererCreateIngredient,
    isNotEmptyDataIngredients,
  ]);

  return (
    <Container
      component={Paper}
      maxWidth="xl"
      elevation={3}
      className="recipe-create-container"
    >
      <form className="auth-content-form" onSubmit={handleonSubmit}>
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
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Описание"
          name="description"
          autoFocus
          value={data.description}
          onChange={hadleChangeInput}
        />
        <Select
          items={R.values(ingredientItems)}
          onChange={handleChangeIngredients}
          withSearch
          onSearch={handleSearchIngredients}
          multiple
          renderSearchContentEmptyItems={rendererCreateIngredient}
          label="Ингредиенты"
        />
        {rendererAlternativeIngredients}
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
