import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "modern-normalize";
import "./index.css";
import App from "./components/App/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/recipe-service-app/">
          <App />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
