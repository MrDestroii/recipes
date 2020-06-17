import * as R from "ramda";

export function getOptionsHeadItems(options = []) {
  return {
    items: options,
    getItemsWithContent: function (contentOptions) {
      return R.map((item) => {
        return R.ifElse(
          R.has(item.value),
          R.compose(
            R.set(R.lensProp("content"), R.__, item),
            R.prop(item.value)
          ),
          R.always(item)
        )(contentOptions);
      })(this.items);
    },
  };
}
