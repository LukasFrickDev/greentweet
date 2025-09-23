import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalCss from "./styles";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <QueryClientProvider client={queryClient}>
          <GlobalCss />
          <App />
        </QueryClientProvider>
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);
