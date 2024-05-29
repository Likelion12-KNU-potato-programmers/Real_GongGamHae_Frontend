import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


//// useAuth와 AuthContext는 AuthProvider 외부에 정의되어야 한다.
// AuthContext 생성     // useAuth 훅 정의
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);



// AuthProvider 컴포넌트 정의
const AuthProvider = ({ children }) => {
    
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    // userid는 설정이 되었지만 nickname은 ?
    const login = (userId, nickname) => {
        setIsLogin(true);
        setUserId(userId);
        setNickname(nickname);
        navigate('/');
    };



    const logout = async () => {
        try {
            console.log(userId);
            // 서버로 로그아웃 요청을 보냄
            const response = await fetch(`http://localhost:8080/mypage/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId }),
            });

            console.log(userId)

            if (response.ok) {
                console.log('Logged out successfully from the server');
            } else {
                console.error('Failed to logout from the server'); // 서버 로그아웃 실패 시 여기서 함수 종료
            }

        } catch (error) {
            console.error('Error logging out from the server:', error); // 에러 발생 시 여기서 함수 종료
        }
        setIsLogin(false);

    };
    


    // AuthContext.Provider로 상태와 함수를 전달
    return (
        <AuthContext.Provider value={{ isLogin, userId, nickname, login, logout, setNickname }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthProvider를 기본 내보내기로 export
export default AuthProvider;
