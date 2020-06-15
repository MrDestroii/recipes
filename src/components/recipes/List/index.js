import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import * as R from "ramda";
import moment from "moment";
import "moment/locale/ru";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import { InfoLikes } from "components/recipes/Likes";
import { SearchInput } from "components/ui/SearchInput";

import { recipeActions } from "store/recipe/actions";
import { getItems } from "store/recipe/selectors";

import { useOrder, TYPE_ORDER_ASC } from "./useOrder";

import "./styles.css";

const optionsSortingHeadItems = [
  {
    label: "Имя",
    value: "name",
  },
  {
    label: "Лайки",
    isDisabledOrder: true
  },
  {
    label: "Сложность",
    value: "complexity",
  },
  {
    label: "Ингредиенты",
    value: "ingredients",
    isDisabledOrder: true
  },
  {
    label: "Дата Создания",
    value: "createdAt",
  },
];

export const RecipesList = () => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [order, handleChangeOrder] = useOrder(optionsSortingHeadItems)

  const items = useSelector(getItems);

  useEffect(() => {
    dispatch(recipeActions.getItems({ searchValue, ...order }));
  }, [dispatch, searchValue, order]);

  const handleOnSearch = useCallback((value) => {
    setSearchValue(value);
  }, []);

  // const rendrerIngredientsFilter = useMemo(() => {
  //   return (
  //     <div>hi filter</div>
  //   )
  // }, [])

  const rendererHeadItems = useMemo(() => {
    return R.map((item) => {
      const isActive = R.propEq("orderBy", item.value)(order);
      const direction = R.compose(
        R.toLower,
        R.ifElse(
          R.always(isActive),
          R.prop("orderType"),
          R.always(TYPE_ORDER_ASC)
        )
      )(order);

      return (
        <TableCell key={item.value || item.label}>
          {R.not(item.isDisabledOrder) ? (
            <TableSortLabel
              active={isActive}
              direction={direction}
              onClick={handleChangeOrder(item.value)}
            >
              {item.label}
            </TableSortLabel>
          ) : (
            item.label
          )}
        </TableCell>
      );
    })(optionsSortingHeadItems);
  }, [order, handleChangeOrder]);

  const rendererItems = useMemo(() => {
    return R.compose(
      R.map((item) => {
        return (
          <TableRow key={item.id}>
            <TableCell component="th" scope="row">
              <Link to={`/recipe/info/${item.id}`}>{item.name}</Link>
            </TableCell>
            <TableCell component="th" scope="row">
              <InfoLikes items={item.likes} recipeId={item.id} />
            </TableCell>
            <TableCell component="th" scope="row">
              {`${item.complexity}/10`}
            </TableCell>
            <TableCell component="th" scope="row">
              <div className="recipe-item-ingredients-list">
                {R.map((ingredient) => {
                  return <span key={ingredient.id}>{ingredient.name}</span>;
                })(item.ingredients)}
              </div>
            </TableCell>
            <TableCell component="th" scope="row">
              {moment(item.createdAt).locale("ru").format("lll")}
            </TableCell>
          </TableRow>
        );
      }),
      R.values
    )(items);
  }, [items]);

  return (
    <TableContainer component={Paper}>
      <SearchInput onSearch={handleOnSearch} />
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>{rendererHeadItems}</TableRow>
        </TableHead>
        <TableBody>{rendererItems}</TableBody>
      </Table>
    </TableContainer>
  );
};
