import { createContext, useContext, useState } from "react";

type AlertType = "success" | "error" | "info";

interface AlertContextType {
    alert: { message: string; type: AlertType } | null;
    setAlert: React.Dispatch<
        React.SetStateAction<{ message: string; type: AlertType } | null>
    >;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<{ message: string; type: AlertType } | null>(
        null
    );

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within a AlertProvider");
    }
    return context;
};