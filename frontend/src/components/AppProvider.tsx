import client from "@/api/graphql/client";
import { AlertProvider } from "@/context/AlertContext";
import usePreloadedAuthState from "@/hooks/usePreloadedAuthState";
import { createStore } from "@/lib/store";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const preloadedAuthState = usePreloadedAuthState();
    const store = createStore(preloadedAuthState);

    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <AlertProvider>
                    {children}
                </AlertProvider>
            </Provider>
        </ApolloProvider>
    );
}

export default AppProvider;