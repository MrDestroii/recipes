import React, { useCallback, useState, useMemo } from "react";

import * as R from "ramda";
import classNames from "classnames";
import { useGesture } from "react-use-gesture";
import { useSprings, animated, interpolate } from "react-spring";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MoveIcon from "@material-ui/icons/BlurCircular";
import RemoveIcon from "@material-ui/icons/Clear";
import InputLabel from "@material-ui/core/InputLabel";

import {
  sortByPosition,
  functionSetSprings,
  findItemIndex,
  HEIGHT_ITEM,
  inputLabelProps,
  inputProps,
  indexedMap,
  updateItemsPositions,
} from "./helpers";

import "./styles.css";

export const StepsCreate = (props) => {
  const { defaultItems, onChange } = props;
  const [items, setItems] = useState(sortByPosition(defaultItems));
  const [isDragging, setIsDragging] = useState(false);

  const itemsLength = useMemo(() => R.length(items), [items]);

  const [springs, setSprings] = useSprings(
    itemsLength,
    functionSetSprings(items)
  );

  const handleChangeItems = useCallback(
    (value, withUpdateItemsPositions) => {
      const itemsWithUpdatesPositions = updateItemsPositions(value);
      setItems(withUpdateItemsPositions ? itemsWithUpdatesPositions : value);
      onChange(itemsWithUpdatesPositions);
    },
    [onChange]
  );

  const bind = useGesture({
    onDrag: ({ args: [currentItem], down, movement: [, y] }) => {
      const currentPosition = R.indexOf(currentItem)(items);
      const newPosition = R.clamp(
        0,
        itemsLength - 1,
        Math.round((currentPosition * 100 + y) / 100)
      );
      const newItems = R.move(currentPosition, newPosition)(items);

      setSprings(
        functionSetSprings(newItems, down, currentItem, currentPosition, y)
      );
      if (R.not(down)) {
        handleChangeItems(newItems);
      }
    },
    onMouseDown: () => {
      setIsDragging(true);
    },
    onMouseUp: () => {
      setIsDragging(false);
    },
  });

  const handleAddItem = useCallback(() => {
    const addedNewStepItems = R.concat(items, [
      { text: "", position: itemsLength },
    ]);
    handleChangeItems(addedNewStepItems);
  }, [items, itemsLength, handleChangeItems]);

  const handleRemoveItem = useCallback(
    (currentItem) => () => {
      handleChangeItems(R.without([currentItem], items), true);
    },
    [items, handleChangeItems]
  );

  const handleChangeItemText = useCallback(
    (currentItem) => ({ target: { value } }) => {
      handleChangeItems(
        R.map(
          R.ifElse(
            R.equals(currentItem),
            R.set(R.lensProp("text"), value),
            R.identity
          )
        )(items)
      );
    },
    [items, handleChangeItems]
  );

  const rendererItems = useMemo(() => {
    return indexedMap(({ zIndex, shadow, y, scale }, i) => {
      const currentItem = R.find(R.propEq("position", i))(items);
      const currentPosition = R.compose(R.inc, findItemIndex(i))(items);
      return (
        <animated.div
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.interpolate(
              (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
            ),
            transform: interpolate(
              [y, scale],
              (y, s) => `translate3d(0,${y}px,0) scale(${s})`
            ),
            height: HEIGHT_ITEM,
          }}
          className="recipe-steps-item-wrapper"
        >
          <div className="recipe-steps-item">
            <RemoveIcon
              fontSize="small"
              className="recipe-steps-item-remove"
              onClick={handleRemoveItem(currentItem)}
            />
            <div className="recipe-steps-item-position">
              <MoveIcon
                {...bind(currentItem)}
                className={classNames("recipe-steps-item-position-icon", {
                  dragging: isDragging,
                })}
              />
              {currentPosition}.
            </div>
            <TextField
              autoFocus
              required
              fullWidth
              variant="outlined"
              margin="normal"
              label="Текст"
              name="text-new-step"
              value={currentItem.text}
              InputProps={inputProps}
              InputLabelProps={inputLabelProps}
              onChange={handleChangeItemText(currentItem)}
            />
          </div>
        </animated.div>
      );
    })(springs);
  }, [
    bind,
    items,
    springs,
    isDragging,
    handleChangeItemText,
    handleRemoveItem,
  ]);

  return (
    <div className="recipe-steps-wrapper">
      <InputLabel>Шаги приготовления:</InputLabel>
      <div
        className="recipe-steps"
        style={{ height: (HEIGHT_ITEM + 10) * itemsLength }}
      >
        {rendererItems}
      </div>
      <Button variant="outlined" color="primary" onClick={handleAddItem}>
        Добавить шаг
      </Button>
    </div>
  );
};

StepsCreate.defaultProps = {
  defaultItems: []
}
