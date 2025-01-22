import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import DashboardLayout from "./components/layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
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
            {/* Redirect /dashboard to /dashboard/home */}
            <Route index element={<Navigate to="/dashboard/home" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;
