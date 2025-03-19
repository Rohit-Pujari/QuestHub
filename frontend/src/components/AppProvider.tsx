"use client"
import { AlertProvider } from '@/lib/context/AlertContext';
import { store, persistor } from '@/lib/store';
import React from 'react'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

interface ProviderProps {
    children: React.ReactNode
}
const AppProvider: React.FC<ProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <AlertProvider>
                    {children}
                </AlertProvider>
            </PersistGate>
        </Provider>
    );
}

export default AppProvider;