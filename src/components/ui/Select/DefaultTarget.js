import React, { useMemo, useCallback, memo } from "react";

import * as R from "ramda";
import classNames from "classnames";

import InputLabel from "@material-ui/core/InputLabel";
import ArrowDownIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import RemoveIcon from "@material-ui/icons/Clear";

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

export const DefaultTarget = (props) => {
  const {
    innerRef,
    label,
    isOpen,
    onClick,
    onRemove,
    selectedItems,
    placeholder,
    multiple,
  } = props;

  const rendererLabel = useMemo(
    () => label && <InputLabel>{label}</InputLabel>,
    [label]
  );

  const rendererArrow = useMemo(
    () => (
      <ArrowDownIcon
        className={classNames("ui-select-input-arrow", { "is-open": isOpen })}
      />
    ),
    [isOpen]
  );

  const renderChipContent = useCallback(
    (item) => {
      return (
        <div className="ui-select-values-chip-content">
          {item.name}
          <Remove onClick={onRemove(item)} />
        </div>
      );
    },
    [onRemove]
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
          <Remove onClick={onRemove(item)} />
        </div>
      );
    }
  }, [multiple, selectedItems, placeholder, renderChipContent, onRemove]);

  return (
    <>
      {rendererLabel}
      <div ref={innerRef} className="ui-select-input" onClick={onClick}>
        {renderSelectedItems}
        {rendererArrow}
      </div>
    </>
  );
};
