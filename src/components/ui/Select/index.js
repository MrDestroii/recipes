import React, { useState, useCallback, useRef, useMemo, memo } from "react";

import * as R from "ramda";
import classNames from "classnames";

import Popover from "@material-ui/core/Popover";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import ArrowDownIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Clear";
import InputLabel from "@material-ui/core/InputLabel";

import { SearchInput } from "components/ui/SearchInput";

import "./styles.css";

const anchorOriginOptions = {
  vertical: "bottom",
  horizontal: "left",
};

const PaperProps = { className: "ui-select-popover-paper" };

const Remove = memo((props) => {
  const { onClick } = props;
  return (
    <RemoveIcon
      className="ui-select-value-remove"
      fontSize="small"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
});

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
  } = props;

  const targetRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const isEmptyItems = useMemo(() => R.isEmpty(items), [items]);

  const handleChangeIsOpen = useCallback(
    (e) => {
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

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

  const renderChipContent = useCallback(
    (item) => {
      return (
        <div className="ui-select-values-chip-content">
          {item.name}
          <Remove onClick={handleOnSelect(item)} />
        </div>
      );
    },
    [handleOnSelect]
  );

  const renderSelectedItems = useMemo(() => {
    if (R.isEmpty(selectedItems)) {
      return <div className="ui-select-input-placeholder">{placeholder}</div>;
    }
    if (multiple) {
      return (
        <div className="ui-select-values-chipes">
          {R.map((selectedItem) => {
            return (
              <Chip
                key={selectedItem.name}
                className="ui-select-values-chip"
                label={renderChipContent(selectedItem)}
              />
            );
          })(selectedItems)}
        </div>
      );
    } else {
      const item = R.head(selectedItems);
      return (
        <div className="ui-select-value">
          {R.prop("name", item)}
          <Remove onClick={handleOnSelect(item)} />
        </div>
      );
    }
  }, [multiple, selectedItems, placeholder, renderChipContent, handleOnSelect]);

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

  const rendererArrow = useMemo(
    () => (
      <ArrowDownIcon
        className={classNames("ui-select-input-arrow", { "is-open": isOpen })}
      />
    ),
    [isOpen]
  );

  const rendererLabel = useMemo(
    () => label && <InputLabel>{label}</InputLabel>,
    [label]
  );

  return (
    <div className="ui-select-wrapper">
      {rendererLabel}
      <div
        ref={targetRef}
        className="ui-select-input"
        onClick={handleChangeIsOpen}
      >
        {renderSelectedItems}
        {rendererArrow}
      </div>
      <Popover
        anchorEl={targetRef.current}
        open={isOpen}
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
