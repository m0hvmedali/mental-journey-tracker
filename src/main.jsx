import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { MusicProvider } from "./contexts/MusicContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { VIEProvider } from "./accessibility/vie";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <VIEProvider debug={false}>
          <MusicProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </MusicProvider>
        </VIEProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);

