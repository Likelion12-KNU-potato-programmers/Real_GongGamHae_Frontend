import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    
    const getInitialState = () => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const { userId, nickname, userCategory, isLogin } = JSON.parse(loggedInUser);
            return {
                isLogin,
                userId,
                nickname,
                userCategory,
            };
        }
        return {
            isLogin: false,
            userId: '',
            nickname: '',
            userCategory: '',
        };
    };

    const [authState, setAuthState] = useState(getInitialState());

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const { userId, nickname, userCategory, isLogin } = JSON.parse(loggedInUser);
            setAuthState({
                isLogin,
                userId,
                nickname,
                userCategory,
            });
        }
    }, []);

    const login = (userId, nickname, userCategory) => {
        const newState = {
            userId,
            nickname,
            userCategory,
            isLogin: true,
        };
        localStorage.setItem('user', JSON.stringify(newState));
        setAuthState(newState);
        navigate('/');
    };

    const logout = async () => {
        try {
            localStorage.removeItem('user');
            setAuthState({
                isLogin: false,
                userId: '',
                nickname: '',
                userCategory: '',
            });
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const updateCategory = (category) => {
        setAuthState((prevState) => {
            const newState = {
                ...prevState,
                userCategory: category,
            };
            localStorage.setItem('user', JSON.stringify(newState)); // user 정보 업데이트
            return newState;
        });
    };

    
    return (
        <AuthContext.Provider value={{ ...authState, login, logout, updateCategory }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
