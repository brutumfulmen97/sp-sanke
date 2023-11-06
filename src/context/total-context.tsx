import { createContext } from "react";

export const TotalContext = createContext<TTotalContext>({
    total: 0,
    setTotal: (total) => {},
});
