import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// AuthContext 생성
const AuthContext = createContext(null);

// useAuth 훅 정의
export const useAuth = () => useContext(AuthContext);

// AuthProvider 컴포넌트 정의
const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState('');
    const [nickname, setNickname] = useState('');
    const [userCategory, setUserCategory] = useState(''); // 카테고리 상태 추가
    const navigate = useNavigate();

    // login 함수 정의
    const login = (userId, nickname) => {
        setIsLogin(true);
        setUserId(userId);
        setNickname(nickname);
        navigate('/');
    };

    // 카테고리 상태 업데이트 함수 정의
    const updateCategory = (category) => {
        setUserCategory(category);
        console.log(12123 + category)
    }
    
    // logout 함수 정의
    const logout = async () => {
        try {
            // 서버로 로그아웃 요청 보내기
            const response = await fetch(`http://localhost:8080/mypage/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId }),
            });

            if (response.ok) {
                console.log('Logged out successfully from the server');
            } else {
                console.error('Failed to logout from the server');
            }
        } catch (error) {
            console.error('Error logging out from the server:', error);
        }
        setIsLogin(false);
    };

    // AuthContext.Provider로 상태와 함수를 전달
    return (
        <AuthContext.Provider value={{ isLogin, userId, nickname, userCategory, login, logout, updateCategory, setNickname }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthProvider를 기본 내보내기로 export
export default AuthProvider;
