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
import { queryClient } from "./lib/queryClient";
import { GlobalProvider } from "./context/GlobalContext";
import { NotificationProvider } from "./context/NotificationContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// Find root element
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <GlobalProvider>
            <ThemeProvider>
              <TranslationProvider>
                <AuthProvider>
                  <NotificationProvider>
                    <FavoritesProvider>
                      <App />
                      <Toaster position="top-center" />
                    </FavoritesProvider>
                  </NotificationProvider>
                </AuthProvider>
              </TranslationProvider>
            </ThemeProvider>
          </GlobalProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
