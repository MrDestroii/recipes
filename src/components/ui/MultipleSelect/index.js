import React, { useMemo, useCallback, useState } from "react";

import * as R from "ramda";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { SearchInput } from "components/ui/SearchInput";

import "./styles.css";

const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 8;
const menuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const MultipleSelect = (props) => {
  const {
    required,
    label,
    value,
    items,
    keyValue,
    keyText,
    withSearchInput,
    onSearch,
    onChange,
    renderSearchContentEmptyItems,
  } = props;

  const [searchValue, setSearchValue] = useState("");

  const handleChange = useCallback(
    ({ target: { value } }) => {
      onChange(value);
    },
    [onChange]
  );

  const selectInput = useMemo(() => <Input required={required} />, [required]);
  const rendererLabel = useMemo(() => <InputLabel>{label}</InputLabel>, [
    label,
  ]);
  const isEmptyItems = useMemo(() => R.isEmpty(items), [items]);

  const renderValue = useCallback(
    (selected) =>
      R.map((item) => {
        const value = R.prop(keyValue, item);
        const text = R.prop(keyText, item);
        return <Chip key={value || text} label={text} />;
      })(selected),
    [keyValue, keyText]
  );

  const rendererItems = useMemo(() => {
    return isEmptyItems ? (
      <div>Not Found</div>
    ) : (
      R.map((item) => {
        const value = R.prop(keyValue, item);
        const text = R.prop(keyText, item);
        return (
          <MenuItem key={value} value={item}>
            {text}
          </MenuItem>
        );
      })(items)
    );
  }, [items, keyValue, keyText, isEmptyItems]);

  const rendererSearchInput = useMemo(() => {
    return (
      withSearchInput && (
        <SearchInput
          onSearch={onSearch}
          inputValue={searchValue}
          onChange={setSearchValue}
          content={isEmptyItems && renderSearchContentEmptyItems}
        />
      )
    );
  }, [
    withSearchInput,
    onSearch,
    searchValue,
    renderSearchContentEmptyItems,
    isEmptyItems,
  ]);

  return (
    <FormControl className="ui-select-form-control">
      {rendererLabel}
      <Select
        multiple
        value={value}
        onChange={handleChange}
        input={selectInput}
        renderValue={renderValue}
        MenuProps={menuProps}
        variant="outlined"
      >
        {rendererSearchInput}
        {rendererItems}
      </Select>
    </FormControl>
  );
};

MultipleSelect.defaultProps = {
  label: "Select...",
  value: [],
  items: [],
  keyValue: "name",
  keyText: "name",
  withSearchInput: false,
};
