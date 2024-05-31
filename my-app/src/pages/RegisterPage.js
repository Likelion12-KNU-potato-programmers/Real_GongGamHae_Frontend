import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/RegisterPage.css'; // CSS 파일 불러오기

const RegisterPage = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const formData = new FormData();
        const user = JSON.stringify({
            userid: id,
            password: password,
            confirmPassword: confirmPassword,
            nickname: nickname
        });
        formData.append('user', new Blob([user], { type: 'application/json' }));
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const data = await response.text();
            console.log('Success:', data);
            alert('회원가입이 완료되었습니다.');
            navigate('/loginPage');
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error:', error);
        }
    };

    return (
        <div className="register-container">
            <h2>회원가입</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>아이디:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>닉네임:</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>비밀번호:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>비밀번호 확인:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>프로필 이미지:</label>
                    <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
                </div>
                <button type="submit" className="submit-button">가입하기</button>
            </form>
            <p className="link">이미 계정이 있으신가요? <Link to="/loginPage">여기를 클릭하여 로그인하세요</Link>.</p>
        </div>
    );
};

export default RegisterPage;
