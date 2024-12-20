import { AlertProvider } from "@/context/AlertContext";
import usePreloadedAuthState from "@/hooks/usePreloadedAuthState";
import { createStore } from "@/lib/store";
import { Provider } from "react-redux";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const preloadedAuthState = usePreloadedAuthState();
    const store = createStore(preloadedAuthState);
    return (
        <Provider store={store}>
            <AlertProvider>
            {children}
            </AlertProvider>
        </Provider>)
}

export default AppProvider;