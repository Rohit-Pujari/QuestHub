"use client"
import { AlertProvider } from '@/lib/context/AlertContext';
import { store } from '@/lib/store';
import React from 'react'
import { Provider } from 'react-redux';

interface ProviderProps {
    children: React.ReactNode
}
const AppProvider: React.FC<ProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <AlertProvider>
                {children}
            </AlertProvider>
        </Provider>
    );
}

export default AppProvider;