import React, { useReducer, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as R from "ramda";

import { TextField, Button } from "@material-ui/core";

import { Select } from "components/ui/Select";
import { StepsCreate } from "./Steps";

import { renderNotify } from "utils/notify";

import { ingredientActions } from "store/ingredient/actions";
import { getItems } from "store/ingredient/selectors";

import {
  recipeCreateReducer,
  initialState,
  actions,
  initialRecipeInfoData,
} from "./reducer";

const isNotEmpty = R.compose(R.not, R.isEmpty);

export const RecipeForm = (props) => {
  const { onSubmit, initialData, isEdit } = props;

  const [data, dispatch] = useReducer(
    recipeCreateReducer,
    R.merge(initialState, initialData)
  );

  const reduxDispatch = useDispatch();
  const ingredientItems = useSelector(getItems);

  useEffect(() => {
    reduxDispatch(ingredientActions.getItems({ name: data.search.ingredient }));
  }, [reduxDispatch, data.search.ingredient]);

  const isNotEmptyDataIngredients = useMemo(
    () => isNotEmpty(data.ingredients),
    [data.ingredients]
  );
  const isNotEmptySteps = useMemo(() => isNotEmpty(data.steps), [data.steps]);
  const isAllStepsTextIsNotEmpty = useMemo(
    () => R.compose(R.all(isNotEmpty), R.map(R.prop("text")))(data.steps),
    [data.steps]
  );

  const hadleChangeInput = useCallback(({ target: { name, value } }) => {
    dispatch(actions.changeData(name, value));
  }, []);

  const handleSearchIngredients = useCallback((value) => {
    dispatch(actions.changeSearch(value));
  }, []);

  const handleChangeIngredients = useCallback((value) => {
    dispatch(actions.ingredientsChange(value));
  }, []);

  const handleCreateIngredient = useCallback(
    (name) => () => {
      reduxDispatch(ingredientActions.create({ name }));
    },
    [reduxDispatch]
  );

  const handleChangeAlternativeIngredients = useCallback(
    (ingredientId) => (value) => {
      dispatch(actions.alternativeIngredientsChange(ingredientId, value));
    },
    []
  );

  const handleChangeSteps = useCallback((value) => {
    dispatch(actions.changeData("steps", value));
  }, []);

  const handleOnSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (
        isNotEmptyDataIngredients &&
        isNotEmptySteps &&
        isAllStepsTextIsNotEmpty
      ) {
        onSubmit({
          name: data.name,
          photo: data.photo,
          complexity: data.complexity,
          ingredients: data.ingredients,
          alternativeIngredients: data.alternativeIngredients,
          description: data.description,
          steps: data.steps,
        });
      } else {
        renderNotify({
          title: "Error",
          text:
            "Форма заполнена неверно, возможно вы не добавили ингредиенты или шаги приготовления!",
        });
      }
    },
    [
      data,
      isNotEmptyDataIngredients,
      isNotEmptySteps,
      isAllStepsTextIsNotEmpty,
      onSubmit,
    ]
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
          {R.compose(
            R.values,
            R.mapObjIndexed((itemIngredients, ingredientId) => {
              const ingredient = R.find(R.propEq("id", ingredientId))(
                data.ingredients
              );
              return (
                <Select
                  key={ingredientId}
                  items={R.values(ingredientItems)}
                  defaultValue={itemIngredients}
                  onChange={handleChangeAlternativeIngredients(ingredientId)}
                  withSearch
                  onSearch={handleSearchIngredients}
                  multiple
                  renderSearchContentEmptyItems={rendererCreateIngredient}
                  label={ingredient.name}
                />
              );
            })
          )(data.alternativeIngredients)}
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

  const rendererSubmitButton = useMemo(
    () => (
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className="auth-content-submit-button"
      >
        {isEdit ? "Обновить" : "Создать"}
      </Button>
    ),
    [isEdit]
  );

  return (
    <form onSubmit={handleOnSubmit}>
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
        defaultValue={data.ingredients}
        onChange={handleChangeIngredients}
        withSearch
        onSearch={handleSearchIngredients}
        multiple
        renderSearchContentEmptyItems={rendererCreateIngredient}
        label="Ингредиенты"
      />
      {rendererAlternativeIngredients}
      <StepsCreate
        defaultItems={initialData.steps}
        onChange={handleChangeSteps}
      />
      {rendererSubmitButton}
    </form>
  );
};

RecipeForm.defaultProps = {
  initialData: initialRecipeInfoData,
};
