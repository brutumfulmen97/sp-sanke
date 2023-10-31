import { createContext } from "react";

type TotalContextType = {
    total: number;
    setTotal: (total: number) => void;
};

export const TotalContext = createContext<TotalContextType>({
    total: 0,
    setTotal: (total: number) => {},
});
