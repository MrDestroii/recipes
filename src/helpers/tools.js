import * as R from "ramda";

export const oneInspectTrue = (functions = [], value) => {
  const functionsIsEmpty = R.isEmpty(functions);
  const allElemFunction = R.all(R.is(Function), functions);
  if (!functionsIsEmpty && allElemFunction) {
    return R.reduceWhile(
      (acc) => !acc,
      (acc, func) => func(value),
      false,
      functions
    );
  } else {
    throw new Error(
      `tools - oneInspectTrue ${
        functionsIsEmpty ? "- functions is empty;" : ""
      } ${!allElemFunction ? "- not all elem is function;" : ""}`
    );
  }
};

export const getErrorMessage = (defaultText) =>
  R.pathOr(defaultText, ["response", "data", "message"]);

export const getAlternativeIngredients = (alternativeIngredients = []) =>
  R.reduce((acc, elem) => {
    const currentData = R.compose(
      R.defaultTo([]),
      R.prop(elem.id)
    )(alternativeIngredients);
    return R.set(R.lensProp(elem.id), currentData)(acc);
  }, {});
