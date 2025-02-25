"use client"
import usePreloadedState from '@/hooks/usePreloadedState'
import { AlertProvider } from '@/lib/context/AlertContext';
import createStore from '@/lib/store'
import React from 'react'
import { Provider } from 'react-redux';

interface ProviderProps {
    children: React.ReactNode
}
const AppProvider: React.FC<ProviderProps> = ({ children }) => {
    const preloadedState = usePreloadedState();
    const store = createStore(preloadedState);
    return (
        <Provider store={store}>
            <AlertProvider>
                {children}
            </AlertProvider>
        </Provider>
    );
}

export default AppProvider;