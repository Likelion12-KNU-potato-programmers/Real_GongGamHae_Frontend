import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext'; // AuthContext에서 useAuth 훅을 가져옴
import '../css/LoginPage.css'; // LoginPage.css 스타일시트 가져오기

const LoginPage = () => {
    const { login } = useAuth(); // useAuth 훅을 사용하여 login 함수 가져오기
    const navigate = useNavigate();
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [nickname, setNickname] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = {
            userAccount: userid,
            password: password,
        };
    
        try {
            // 로그인 요청
            const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });
    
            if (loginResponse.ok) {
                const responseData = await loginResponse.text();
                login(userid); // 사용자 정보를 인자로 login 함수 호출
                console.log('로그인 성공:', responseData);
                navigate('/');
            
                // 정보 요청
                const nicknameResponse = await fetch('http://localhost:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // 쿠키를 포함하여 요청
                });

                console.log(nicknameResponse)
                if (nicknameResponse.ok) {
                    const nicknameData = await nicknameResponse.json(); // JSON으로 파싱
                    login(nicknameData.userAccount, nicknameData.nickname)
                    setNickname(nicknameData.nickname); // 닉네임을 상태로 설정
                    setUserid(nicknameData.userAccount)
                    console.log(nicknameData)

                } else {
                    console.error('닉네임 가져오기 실패:', nicknameResponse.statusText);
                    // 실패 시 적절한 오류 처리
                }
            }
        } catch (error) {
            console.error('로그인 오류:', error.message);
            setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };
    
    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>ID:</label>
                    <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="login-button" type="submit">로그인</button>
            </form>
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <p>아직 계정이 없으신가요? <Link to="/registerpage">여기를 클릭하여 회원가입하세요</Link>.</p>
            {nickname && <p>환영합니다, {nickname}님!</p>}
        </div>
    );
};

export default LoginPage;
