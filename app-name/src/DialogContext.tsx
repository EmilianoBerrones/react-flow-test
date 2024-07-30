import React, { createContext, useState, useContext } from 'react';

interface DialogContextProps {
    isOpen: boolean;
    openDialog: () => void;
    closeDialog: () => void;
    formData: any;
    setFormData: (data: any) => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return (
        <DialogContext.Provider value={{ isOpen, openDialog, closeDialog, formData, setFormData }}>
            {children}
        </DialogContext.Provider>
    );
};

export const useDialog = (): DialogContextProps => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};
