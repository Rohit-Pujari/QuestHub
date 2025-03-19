import React from 'react'

interface ModalProps {
    title: string
    onClose: () => void
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 max-w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-white hover:text-red-500">✖</button>
                </div>
                <div className="max-h-80 overflow-y-auto">{children}</div>
            </div>
        </div>
    )
}

export default Modal