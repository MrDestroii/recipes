import React, {
  forwardRef,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";

import * as R from "ramda";

import TextField from "@material-ui/core/TextField";

export const SearchInput = forwardRef((props, ref) => {
  const { onSearch, className, inputValue, onChange } = props;

  const timer = useRef();

  const [valueState, setValue] = useState("");

  const currentOptions = useMemo(() => {
    const isNilPropsDatas = R.compose(
      R.includes(true),
      R.map(R.isNil)
    )([inputValue, onChange]);
    return isNilPropsDatas
      ? {
          value: valueState,
          onChange: setValue,
        }
      : {
          value: inputValue,
          onChange,
        };
  }, [valueState, inputValue, onChange]);

  const handleChange = useCallback(
    ({ target: { value } }) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      currentOptions.onChange(value);

      timer.current = setTimeout(() => {
        onSearch(value);
      }, 800);
    },
    [onSearch, currentOptions]
  );

  return (
    <TextField
      innerRef={ref}
      variant="outlined"
      margin="normal"
      fullWidth
      autoFocus
      label="Поиск"
      onChange={handleChange}
      value={currentOptions.value}
      className={className}
    />
  );
});
