import * as R from "ramda";

const currentStorage = localStorage;
const prefix = "secret-project:";

const withPrefix = (name) => prefix + name;

export const storage = (name) => {
  const nameWithPrefix = withPrefix(name);
  return {
    set: (value) => currentStorage.setItem(nameWithPrefix, value),
    get: () => currentStorage.getItem(nameWithPrefix),
    remove: () => currentStorage.removeItem(nameWithPrefix),
    has: () => R.includes(nameWithPrefix, R.keys(currentStorage)),
  };
};
