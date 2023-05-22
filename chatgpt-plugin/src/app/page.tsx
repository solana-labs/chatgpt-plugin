"use client";

import { useEffect } from "react";
import {
  Router,
  Switch,
  Redirect,
  BrowserRouter,
  Route,
} from "react-router-dom";

export default function Home() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={() => {
              window.location.href = "https://solana.com/ai";
              return null;
            }}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
}
