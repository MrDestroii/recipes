import React, { useRef, useMemo } from "react";

import * as R from "ramda";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import { TYPE_ORDER_ASC } from "./useOrder";

export const HeadItem = (props) => {
  const {
    value,
    label,
    isDisabledOrder,
    order,
    handleChangeOrder,
    children,
  } = props;

  const refItem = useRef();

  const rendererContent = () => {
    if (R.not(isDisabledOrder)) {
      const isActive = R.propEq("orderBy", value)(order);
      const direction = R.compose(
        R.toLower,
        R.ifElse(
          R.always(isActive),
          R.prop("orderType"),
          R.always(TYPE_ORDER_ASC)
        )
      )(order);

      return (
        <TableSortLabel
          active={isActive}
          direction={direction}
          onClick={handleChangeOrder(value)}
        >
          {label}
        </TableSortLabel>
      );
    } else {
      return label;
    }
  };

  const rendererChildren = useMemo(() => {
    return R.is(Function, children) ? children(refItem) : children;
  }, [children]);

  return (
    <TableCell key={value || label} innerRef={refItem}>
      <div className="recipe-list-head-item-content">
        {rendererContent()}
        {rendererChildren}
      </div>
    </TableCell>
  );
};
