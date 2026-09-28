import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSpeech } from "./lib/speech";
import "./index.css";

initSpeech();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
