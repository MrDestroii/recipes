import React, { memo } from "react";

import Typography from "@material-ui/core/Typography";

export const InfoIngredient = memo((props) => {
  const { data, prefix } = props;

  const name = `${prefix} ${data.name}`;
  return <Typography variant="body2">{name}</Typography>;
});

InfoIngredient.defaultProps = {
  prefix: "",
};
