import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}