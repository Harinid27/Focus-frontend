import React from "react";
import AppRouter from "./router/AppRouter";
import { SessionProvider } from "./context/SessionContext";

export default function App() {
  return (
    <SessionProvider>
      <AppRouter />
    </SessionProvider>
  );
}
