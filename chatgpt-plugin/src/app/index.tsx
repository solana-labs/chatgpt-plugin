"use client";
import { BrowserRouter, Route, Switch } from "react-router-dom";

export default function Home() {
  return (
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
  );
}
