import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <div>
            <h2>회원가입</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>아이디:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                    <label>닉네임:</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label>비밀번호 확인:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <label>프로필 이미지:</label>
                    <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
                </div>
                <button type="submit">가입하기</button>
            </form>
            <p>이미 계정이 있으신가요? <Link to="/loginPage">여기를 클릭하여 로그인하세요</Link>.</p>
        </div>
    );
};

export default RegisterPage;








/*
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // 비밀번호 확인
      if (password !== confirmPassword) {
          alert('비밀번호가 일치하지 않습니다.');
          return;
      }
  
      // FormData 객체 생성 및 데이터 추가
      const formData = new FormData();
      formData.append('user', JSON.stringify({
        nickname: nickname,
        password: password,
        profileImage: profileImage,
        userid: id
      }));
      formData.append('profileImage', profileImage); // 프로필 이미지는 별도로 추가
      try {
          const response = await fetch('http://localhost:8080/api/auth/register', {
              method: 'POST',
              body: formData
          });
  
          if (!response.ok) {
              throw new Error('Failed to register user');
          }
  
          const data = await response.json();
          console.log('Success:', data);
          alert('회원가입이 완료되었습니다.');
          navigate('/loginPage');
  
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  
  

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>아이디:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                    <label>닉네임:</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label>비밀번호 확인:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <label>프로필 이미지:</label>
                    <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
                </div>
                <button type="submit">가입하기</button>
            </form>
            <p>이미 계정이 있으신가요? <Link to="/loginPage">여기를 클릭하여 로그인하세요</Link>.</p>
        </div>
    );
};

export default RegisterPage;


*/