import React, { Fragment, memo } from "react";

import * as R from "ramda";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { InfoIngredient } from "./Ingredient";

const Alternative = (props) => {
  const { ingredients } = props;
  
  const nameIngredient = R.compose(
    R.path(["ingredient", "name"]),
    R.head
  )(ingredients);

  return (
    <Fragment>
      <Typography variant="body2">{nameIngredient}</Typography>
      <Grid
        container
        direction="column"
        className="recipe-info-alt-ingredient-ingredients"
      >
        {R.map((alternativeIngredient) => (
          <InfoIngredient
            key={alternativeIngredient.id}
            data={alternativeIngredient.ingredientAlternative}
            prefix="-"
          />
        ))(ingredients)}
      </Grid>
    </Fragment>
  );
};

export const InfoAlternativeIngredients = memo((props) => {
  const { items } = props;
  return (
    <Grid container direction="column">
      {R.compose(
        R.values,
        R.mapObjIndexed((ingredients, id) => (
          <Alternative key={id} ingredients={ingredients} />
        )),
        R.groupBy(R.path(["ingredient", "id"]))
      )(items)}
    </Grid>
  );
});
