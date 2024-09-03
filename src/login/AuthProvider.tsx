import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';

interface AuthContextType {
    isAdmin: boolean;
    toggleAdmin: (status: boolean) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const toggleAdmin = (status: boolean) => {
        localStorage.setItem('isAdmin', status + '');
        setIsAdmin(status);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, toggleAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

