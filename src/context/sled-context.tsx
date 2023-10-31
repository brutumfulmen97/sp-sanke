import { createContext } from "react";

type SledContextType = {
    sleds: Sled[];
    setSleds: (sleds: Sled[]) => void;
};

export const SledContext = createContext<SledContextType>({
    sleds: [],
    setSleds: (sleds: Sled[]) => {},
});
