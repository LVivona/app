'use client';
import { createContext, useContext, useState, ReactNode } from "react";
import { ModuleState } from "../types/module";

export const defaultModule: ModuleState = {
  name: "agi",
  key: "agi",
  url: "agi.com",
  description: "agi module",
  network: "eth",
};

interface ModuleContextType {
  selectedModules: ModuleState[];
  addModule: (module: ModuleState) => void;
  removeModule: (key: string) => void;
  createModule: (module : ModuleState) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedModules, setSelectedModules] = useState<ModuleState[]>([]);

  const addModule = (module: ModuleState) => {
    setSelectedModules((prev) => {
      if (!prev.find((m) => m.key === module.key)) {
        return [...prev, module];
      }
      return prev;
    });
  };

  const removeModule = (key: string) => {
    setSelectedModules((prev) => prev.filter((module) => module.key !== key));
  };

  const createModule = (module : ModuleState) => {
    if (selectedModules.find((m) => m.key === module.key)) {
        throw new Error("Module already exsit")
      }
      setSelectedModules((prev) => [...prev, module]);
      return;
  }

  return (
    <ModuleContext.Provider value={{ selectedModules, addModule, removeModule, createModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModules must be used within a ModuleProvider");
  }
  return context;
};
