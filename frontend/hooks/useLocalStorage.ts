import { useEffect, useState } from 'react';

interface LocalStorage {
    loading: boolean;
    setItem: (key: string, value: any) => void;
    getItem: (key: string) => any;
    removeItem: (key: string) => void;
    removeAllItems: () => void;
}

const useLocalStorage = (): LocalStorage => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeLocalStorage();
    }, []);

    const initializeLocalStorage = () => {
        try {
            if (typeof window !== 'undefined') {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error initializing local storage:', error);
            setLoading(false);
        }
    };

    const setItem = (key: string, value: any) => {
        try {
            if (typeof window !== 'undefined') {
                const valueToStore = JSON.stringify(value);
                localStorage.setItem(key, valueToStore);
            }
        } catch (error) {
            console.error(`Error storing in local storage: ${error}`);
        }
    };

    const getItem = (key: string): any => {
        try {
            if (typeof window !== 'undefined') {
                const storedItem = localStorage.getItem(key);
                return storedItem ? JSON.parse(storedItem) : null;
            }
            return null;
        } catch (error) {
            console.error(`Error retrieving from local storage: ${error}`);
            return null;
        }
    };

    const removeItem = (key: string) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing from local storage: ${error}`);
        }
    };

    const removeAllItems = () => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.clear();
            }
        } catch (error) {
            console.error(`Error clearing local storage: ${error}`);
        }
    };

    return { loading, setItem, getItem, removeItem, removeAllItems };
};

export default useLocalStorage;
