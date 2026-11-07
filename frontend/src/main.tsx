import { startDeployRefreshWatcher } from "./lib/deployRefresh";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";
import { AuthProvider } from "./admin/components/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TranslationProvider } from "./context/TranslationContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { queryClient } from "./lib/queryClient";
import { GlobalProvider } from "./context/GlobalContext";
import { NotificationProvider } from "./context/NotificationContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// Find root element
startDeployRefreshWatcher();

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <GlobalProvider>
            <ThemeProvider>
              <TranslationProvider>
                <CurrencyProvider>
                  <AuthProvider>
                    <NotificationProvider>
                      <FavoritesProvider>
                        <App />
                        <Toaster position="top-center" />
                      </FavoritesProvider>
                    </NotificationProvider>
                  </AuthProvider>
                </CurrencyProvider>
              </TranslationProvider>
            </ThemeProvider>
          </GlobalProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
