import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as R from "ramda";

import FilterIcon from "@material-ui/icons/FilterList";

import { Select } from "components/ui/Select";

import { getItems } from "store/ingredient/selectors";
import { ingredientActions } from "store/ingredient/actions";

export const FilterIngredietns = (props) => {
  const { innerRef, onChange } = props;

  const dispatch = useDispatch();

  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(ingredientActions.getItems({ name: searchValue }));
  }, [dispatch, searchValue]);

  const ingredientItems = useSelector(getItems);

  const handleChangeIsOpen = useCallback(() => {
    setIsOpenSelect(!isOpenSelect);
  }, [isOpenSelect]);

  const handleOnSearch = useCallback((value) => {
    setSearchValue(value);
  }, []);

  return (
    <>
      <FilterIcon onClick={handleChangeIsOpen} className="recipe-list-filter-icon" />
      <Select
        items={R.values(ingredientItems)}
        onChange={onChange}
        withSearch
        onSearch={handleOnSearch}
        multiple
        label="Ингредиенты"
        innerRefTarget={innerRef}
        open={isOpenSelect}
        onClose={handleChangeIsOpen}
      />
    </>
  );
};
