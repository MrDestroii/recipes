import { useState, useCallback } from "react";

import * as R from "ramda";

export const TYPE_ORDER_ASC = "ASC";
export const TYPE_ORDER_DESC = "DESC";

export const useOrder = () => {
  const [order, setOrder] = useState({
    orderBy: "createdAt",
    orderType: TYPE_ORDER_ASC,
  });

  const handleChangeOrder = useCallback(
    (value) => () => {
      const isEqualOrderField = R.compose(
        R.equals(value),
        R.prop("orderBy")
      )(order);
      const isAsc = R.compose(
        R.equals(TYPE_ORDER_ASC),
        R.prop("orderType")
      )(order);
      setOrder({
        orderBy: value,
        orderType:
          isEqualOrderField && isAsc ? TYPE_ORDER_DESC : TYPE_ORDER_ASC,
      });
    },
    [order]
  );

  return [order, handleChangeOrder];
};
