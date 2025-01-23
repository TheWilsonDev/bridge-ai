import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import DashboardLayout from "./components/layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import UsagePage from "./pages/UsagePage";
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="settings">
              <Route path="user" element={<UserSettingsPage />} />
              <Route path="usage" element={<UsagePage />} />
              {/* Redirect /settings to /settings/user */}
              <Route index element={<Navigate to="/dashboard/settings/user" replace />} />
            </Route>
            {/* Redirect /dashboard to /dashboard/home */}
            <Route index element={<Navigate to="/dashboard/home" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;
