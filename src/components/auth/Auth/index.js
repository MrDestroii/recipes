import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { authActions } from "store/auth/actions";

import "./styles.css";

export const Auth = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(authActions.signIn(data));
    },
    [dispatch, data]
  );

  const handleChangeData = useCallback(
    ({ target: { name, value } }) => {
      setData({ ...data, [name]: value });
    },
    [data]
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="auth-content-wrapper">
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className="auth-content-form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={data.email}
            onChange={handleChangeData}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={data.password}
            onChange={handleChangeData}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="auth-content-submit-button"
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
};
