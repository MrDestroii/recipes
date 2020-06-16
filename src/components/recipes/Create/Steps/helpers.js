import * as R from "ramda";

export const HEIGHT_ITEM = 90;

export const inputProps = { className: "recipe-steps-item-position-input" };
export const inputLabelProps = {
  className: "recipe-steps-item-position-input-label",
};

export const findItemIndex = (index) =>
  R.findIndex(R.propEq("position", index));
export const sortByPosition = R.sortBy(R.prop("position"));
export const indexedMap = R.addIndex(R.map);
export const updateItemsPositions = indexedMap((item, index) =>
  R.set(R.lensProp("position"), index)(item)
);

export const functionSetSprings = (items, down, currentItem, curIndex, y) => (
  index
) =>
  down && index === currentItem.position
    ? {
        y: curIndex * 100 + y,
        scale: 1.02,
        zIndex: "1",
        shadow: 15,
        immediate: (n) => n === "y" || n === "zIndex",
      }
    : {
        y: findItemIndex(index)(items) * 100,
        scale: 1,
        zIndex: "0",
        shadow: 1,
        immediate: false,
      };
