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

import { InfoLikes } from "components/recipes/Likes";
import { FilterIngredietns } from "components/recipes/List/FilterIngredients";
import { HeadItem } from "components/recipes/List/HeadItem";
import { SearchInput } from "components/ui/SearchInput";
import { EditRecipe } from "components/ui/EditRecipe";

import { recipeActions } from "store/recipe/actions";
import { getItems } from "store/recipe/selectors";
import { getProfileId } from "store/auth/selectors";

import { useOrder } from "./useOrder";
import { getOptionsHeadItems } from "./optionsHeadItems";

import "./styles.css";

const optionsHeadItems = getOptionsHeadItems([
  {
    label: "Имя",
    value: "name",
  },
  {
    label: "Лайки",
    value: "likes",
    isDisabledOrder: true,
  },
  {
    label: "Сложность",
    value: "complexity",
  },
  {
    label: "Ингредиенты",
    value: "ingredients",
    isDisabledOrder: true,
  },
  {
    label: "Дата Создания",
    value: "createdAt",
  },
]);

export const RecipesList = () => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [filterIngredietns, setFilterIngredients] = useState([]);
  const [order, handleChangeOrder] = useOrder(optionsHeadItems);

  const items = useSelector(getItems);
  const userId = useSelector(getProfileId);

  useEffect(() => {
    dispatch(
      recipeActions.getItems({
        searchValue,
        ingredients: filterIngredietns,
        ...order,
      })
    );
  }, [dispatch, searchValue, order, filterIngredietns]);

  const handleOnSearch = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const headItemsContent = useMemo(() => {
    return {
      ingredients: (ref) => (
        <FilterIngredietns
          innerRef={ref}
          onChange={(value) => setFilterIngredients(R.map(R.prop("id"))(value))}
        />
      ),
    };
  }, []);

  const rendererHeadItems = useMemo(() => {
    return R.map((item) => {
      return (
        <HeadItem
          key={item.value}
          value={item.value}
          label={item.label}
          isDisabledOrder={item.isDisabledOrder}
          order={order}
          handleChangeOrder={handleChangeOrder}
        >
          {item.content}
        </HeadItem>
      );
    })(optionsHeadItems.getItemsWithContent(headItemsContent));
  }, [order, handleChangeOrder, headItemsContent]);

  const rendererItems = useMemo(() => {
    return R.compose(
      R.map((item) => {
        const isItemCurrentUser = R.compose(
          R.equals(userId),
          R.path(["user", "id"])
        )(item);

        return (
          <TableRow key={item.id}>
            <TableCell component="th" scope="row">
              <div className="recipe-item-name-wrapper">
                <Link
                  className="recipe-item-name"
                  to={`/recipe/info/${item.id}`}
                >
                  {item.name}
                </Link>
                {isItemCurrentUser && <EditRecipe id={item.id} />}
              </div>
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
  }, [items, userId]);

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
