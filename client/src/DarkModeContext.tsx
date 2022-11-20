import React, { useContext } from "react";


export const DarkModeContext = React.createContext({ toggle: () => {}, isDarkMode: false });


export function useDarkModeContext() {
    return useContext(DarkModeContext);
}