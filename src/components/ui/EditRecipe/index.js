import React from "react";

import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";

export const EditRecipe = (props) => {
  const { id } = props;

  return (
    <Link to={`/recipe/edit/${id}`}>
      <EditIcon fontSize="small" />
    </Link>
  );
};
