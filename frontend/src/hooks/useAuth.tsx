import React, { useState } from 'react';

const loadUserData = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
};

const useAuth = () => {
    const [user, setUser] = useState(loadUserData());

    return { user, setUser };
};

export default useAuth; 