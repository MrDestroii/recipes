import React from "react";

import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LoginAppIcon from "@material-ui/icons/LockOpen";

import "./styles.css";

export const AuthButton = (props) => {
  const { isLogged, onClick } = props;

  const Icon = isLogged ? ExitToAppIcon : LoginAppIcon;

  return (
    <IconButton className="auth-logout-button" onClick={onClick}>
      <Icon className="auth-logout-button-icon" />
    </IconButton>
  );
};
