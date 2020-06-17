import React, { memo } from "react";

import * as R from "ramda";

import Grid from "@material-ui/core/Grid";

export const InfoRecipeSteps = memo((props) => {
  const { items } = props;

  return (
    <Grid container direction="column" className="recipe-info-steps">
      {R.compose(
        R.map((step) => {
          return <span key={step.id}>- {step.text}</span>;
        }),
        R.sortBy(R.prop("position"))
      )(items)}
    </Grid>
  );
});
