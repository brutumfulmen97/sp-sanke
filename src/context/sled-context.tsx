import { createContext } from "react";

export const SledContext = createContext({
    sleds: [],
    setSleds: (sleds: any) => {},
});
