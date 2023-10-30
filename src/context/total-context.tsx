import { createContext } from "react";

export const TotalContext = createContext({
    total: [],
    setTotal: (total: any) => {},
});
