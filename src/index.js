import React from "react";
import ReactDOM from "react-dom";

import App from "components/App";

import * as serviceWorker from "./serviceWorker";

import "./index.css";
import { Provider } from "react-redux";
import { store, history } from "store";
import { ConnectedRouter } from "connected-react-router";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
