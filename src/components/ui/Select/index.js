import React, { useState, useCallback, useRef, useMemo } from "react";

import * as R from "ramda";

import Popover from "@material-ui/core/Popover";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { SearchInput } from "components/ui/SearchInput";

import { DefaultTarget } from "./DefaultTarget";

import "./styles.css";

const anchorOriginOptions = {
  vertical: "bottom",
  horizontal: "left",
};

const PaperProps = { className: "ui-select-popover-paper" };

export const Select = (props) => {
  const {
    items,
    onChange,
    multiple,
    placeholder,
    withSearch,
    renderSearchContentEmptyItems,
    onSearch,
    label,
    innerRefTarget,
    open,
    onClose,
  } = props;

  const targetRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const isEmptyItems = useMemo(() => R.isEmpty(items), [items]);
  const isNilInnerRefTarget = useMemo(() => R.isNil(innerRefTarget), [
    innerRefTarget,
  ]);

  const handleChangeIsOpen = useCallback(() => {
    if (R.all(R.isNil, [onClose, open])) {
      setIsOpen(!isOpen);
    } else {
      onClose();
    }
  }, [isOpen, onClose, open]);

  const handleOnSelect = useCallback(
    (item) => () => {
      const newValueSelectedItems = R.symmetricDifference(
        selectedItems,
        multiple ? [item] : [...selectedItems, item]
      );
      onChange(newValueSelectedItems);
      setSelectedItems(newValueSelectedItems);

      if (R.not(multiple)) {
        handleChangeIsOpen();
      }
    },
    [selectedItems, onChange, multiple, handleChangeIsOpen]
  );

  const rendererItems = useMemo(() => {
    return isEmptyItems ? (
      <div>Not Found</div>
    ) : (
      R.map((item) => {
        const isChecked = R.includes(item, selectedItems);
        return (
          <FormControlLabel
            key={item.name}
            className="ui-select-item"
            control={
              <Checkbox checked={isChecked} name="checkedB" color="primary" />
            }
            label={item.name}
            onChange={handleOnSelect(item)}
          />
        );
      })(items)
    );
  }, [isEmptyItems, items, handleOnSelect, selectedItems]);

  const rendererSearchInput = useMemo(() => {
    return (
      withSearch && (
        <SearchInput
          onSearch={onSearch}
          inputValue={searchValue}
          onChange={setSearchValue}
          content={isEmptyItems && renderSearchContentEmptyItems}
        />
      )
    );
  }, [
    withSearch,
    onSearch,
    searchValue,
    renderSearchContentEmptyItems,
    isEmptyItems,
  ]);

  const rendererDefaultTarget = useMemo(() => {
    return (
      isNilInnerRefTarget && (
        <DefaultTarget
          innerRef={targetRef}
          label={label}
          isOpen={isOpen}
          onClick={handleChangeIsOpen}
          onRemove={handleOnSelect}
          placeholder={placeholder}
          selectedItems={selectedItems}
          multiple={multiple}
        />
      )
    );
  }, [
    isNilInnerRefTarget,
    handleChangeIsOpen,
    handleOnSelect,
    isOpen,
    label,
    multiple,
    placeholder,
    selectedItems,
  ]);

  return (
    <div className="ui-select-wrapper">
      {rendererDefaultTarget}
      <Popover
        anchorEl={R.prop("current", innerRefTarget || targetRef)}
        open={open || isOpen}
        onClose={handleChangeIsOpen}
        className="ui-select-popover"
        PaperProps={{
          ...PaperProps,
          style: {
            width: R.prop("clientWidth", targetRef.current),
          },
        }}
        anchorOrigin={anchorOriginOptions}
      >
        {rendererSearchInput}
        {rendererItems}
      </Popover>
    </div>
  );
};

Select.defaultProps = {
  placeholder: "Select...",
};
