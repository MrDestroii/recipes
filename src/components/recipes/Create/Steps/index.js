import React, { useRef, useCallback, useState, useMemo } from "react";

import * as R from "ramda";
import { useGesture } from "react-use-gesture";
import { useSprings, animated, interpolate } from "react-spring";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import "./styles.css";

const HEIGHT_ITEM = 90;

const fn = (order, down, currentItem, y) => (index) => {
  if (down && index === currentItem.position) {
    return {
      y: currentItem.position * 100 + y,
      scale: 1.03,
      zIndex: "1",
      shadow: 15,
      immediate: (n) => n === "y" || n === "zIndex",
    };
  } else {
    if(down) {
      return {
      y: order[index].position * 100,
      scale: 1,
      zIndex: "0",
      shadow: 1,
      immediate: false,
      }
    } else {
      return {
        y: order[index].position * 100,
        scale: 1,
        zIndex: "0",
        shadow: 1,
        immediate: false,
      };
    }
  }
};

const setPosition = (value) => R.set(R.lensProp("position"), value);

export const StepsCreate = ({ defaultItems, onChange }) => {
  const order = useRef(defaultItems);

  const [items, setItems] = useState(defaultItems);
  const [valueNewItem, setValueNewItem] = useState("");

  const itemsLength = useMemo(() => R.length(items), [items]);

  const [springs, setSprings] = useSprings(itemsLength, fn(order.current));

  const bind = useGesture({
    onDrag: ({ args: [currentItem], down, movement: [, y] }) => {
      const newPosition = R.clamp(
        0,
        itemsLength - 1,
        Math.round((currentItem.position * 100 + y) / 100)
      );

      const newPositionGreatThenCurrentItemPosition = R.gt(
        newPosition,
        currentItem.position
      );
      const isNotEqualNewPositionCurrentItemPosition = R.not(
        R.equals(newPosition, currentItem.position)
      );

      const newOrder = R.compose(
        R.map((item) => {
          if (isNotEqualNewPositionCurrentItemPosition) {
            if (R.equals(item.position, currentItem.position)) {
              return setPosition(Math.abs(newPosition))(currentItem);
            }
            if (newPositionGreatThenCurrentItemPosition) {
              if (
                R.and(
                  R.lte(item.position, newPosition),
                  R.not(R.equals(item.position, 0))
                )
              ) {
                return setPosition(R.dec(item.position))(item);
              }
            } else {
              if (
                R.and(
                  R.lte(newPosition, item.position),
                  R.lt(item.position, currentItem.position)
                )
              ) {
                return setPosition(R.inc(item.position))(item);
              }
            }
          }
          return item;
        })
      )(order.current);

      setSprings(fn(newOrder, down, currentItem, y));
      if (!down) {
        const sortedNewOrder = R.sortBy(R.prop("position"))(newOrder);
        setItems(sortedNewOrder);
        order.current = sortedNewOrder;
      }
    },
  });

  const handleAddItem = useCallback(() => {
    const addedNewStepItems = R.concat(items, [
      { text: valueNewItem, position: itemsLength },
    ]);
    setItems(addedNewStepItems);
    setSprings(fn(addedNewStepItems));
    order.current = addedNewStepItems;
  }, [items, setSprings, valueNewItem, itemsLength]);

  console.log({ items, springs });

  const rendererItems = useMemo(() => {
    return springs.map(({ zIndex, shadow, y, scale }, i) => {
      const currentItem = R.find(R.propEq("position", i))(items);
      return (
        <animated.div
          {...bind(currentItem)}
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
          className="content-item"
        >
          <div className="content-item-content">
            <span className="content-item-position">{`${
              R.prop("position")(currentItem) + 1
            }.`}</span>
            <span className="content-item-text">{currentItem.text}</span>
          </div>
        </animated.div>
      );
    });
  }, [bind, items, springs]);

  return (
    <div>
      <div
        className="content"
        style={{ height: (HEIGHT_ITEM + 10) * itemsLength }}
      >
        {rendererItems}
      </div>
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Текст"
          name="text-new-step"
          autoFocus
          value={valueNewItem}
          onChange={({ target: { value } }) => {
            setValueNewItem(value);
          }}
        />
        <Button onClick={handleAddItem}>Добавить шаг</Button>
      </div>
    </div>
  );
};
