import React from 'react'
import { useAlert } from './AlertContext'
import Alert from '@/components/Alert';

const GlobalAlert = () => {
    const { alert, setAlert } = useAlert();
    return alert && (
        <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
        />

    )
}

export default GlobalAlert