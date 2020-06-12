import React, { useState, useCallback, useRef, useMemo } from "react";

import * as R from "ramda";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import "./styles.css";
import { Link } from "react-router-dom";

const options = [
  {
    text: "На Главную",
    component: Link,
    to: "/",
  },
];

const loggedOptions = [
  {
    text: "Создать Рецепт",
    component: Link,
    to: "/recipe/create",
  },
];

export const AppMenu = (props) => {
  const { isLogged } = props;
  const buttonRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpenMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const renderMenuItem = useCallback(
    (itemOption) => {
      const { text, ...otherParams } = itemOption;
      return (
        <MenuItem key={text} {...otherParams} onClick={handleClose}>
          {text}
        </MenuItem>
      );
    },
    [handleClose]
  );

  const rendererOptions = useMemo(() => {
    return R.map(renderMenuItem)(options);
  }, [renderMenuItem]);

  const rendrerIsLoggedItems = useMemo(() => {
    return isLogged && R.map(renderMenuItem)(loggedOptions);
  }, [isLogged, renderMenuItem]);

  return (
    <div className="app-menu-wrapper">
      <Button innerRef={buttonRef} onClick={handleClickOpenMenu}>
        Menu
      </Button>
      <Menu anchorEl={buttonRef.current} open={isOpen} onClose={handleClose}>
        {rendererOptions}
        {rendrerIsLoggedItems}
      </Menu>
    </div>
  );
};
