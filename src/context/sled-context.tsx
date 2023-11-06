import { createContext } from "react";

export const SledContext = createContext<TSledContext>({
    sleds: [],
    setSleds: (sleds) => {},
});
