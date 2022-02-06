import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
    const [val, setVal] = useState(() => {
        try {
            const value = JSON.parse(window.localStorage.getItem(key))
            return value ? value : initialValue
        }   
        catch(err) {
            return initialValue
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(val));
    }, [val]);

    return [val, setVal];
}

export default useLocalStorage;