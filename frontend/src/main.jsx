import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.js";
import App from "./App.jsx";
import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <div dir="rtl" style={{ fontFamily: "Vazirmatn" }}>
        <App />
      </div>
    </Provider>
  </StrictMode>
);
