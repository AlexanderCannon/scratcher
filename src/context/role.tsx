import { UserRole } from "@prisma/client";
import React, { useState, createContext } from "react";

interface UserContextValue {
  role?: UserRole;
  setRole: React.Dispatch<React.SetStateAction<UserRole | undefined>>;
}

export const RoleContext = createContext<UserContextValue>({
  role: UserRole.USER,
  setRole: () => {},
});

export const RoleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [role, setRole] = useState<UserRole>();

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
