import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/context/theme-provider.tsx";
import { Provider } from "react-redux";
import { store } from "@/context/store/store.ts";
import { BrowserRouter } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
          <ToastContainer
            position="bottom-left"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
