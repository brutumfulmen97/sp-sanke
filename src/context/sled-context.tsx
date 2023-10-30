import { createContext, useState } from "react";

export const SledContext = createContext({
    sleds: [],
    setSleds: (sleds: any) => {},
});
