import React, { createContext, useContext } from "react";
import { useGame } from "../hooks/useGame";

type ContextType = ReturnType<typeof useGame>;

const Context = createContext<ContextType>({} as ContextType);

type Props = { children: React.ReactNode };

export const GameContextProvider = ({ children }: Props) => {
	const game = useGame();
	return <Context.Provider value={game}>{children}</Context.Provider>;
};

export const useGameContext = () => useContext(Context);
