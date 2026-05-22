import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [filters, setFilters] = useState({});

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        plans,
        setPlans,
        filters,
        setFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}