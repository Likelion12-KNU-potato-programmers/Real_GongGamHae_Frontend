import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext'; // useAuth 가져오기

const MyPage = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);    // 닉네임 옆의 연필버튼의 드롭다운 on off 버튼
    const dropdownRef = useRef(null);                               // 찾아봐야함
    const navigate = useNavigate();
    const { isLogin, userId, nickname, logout, setNickname } = useAuth(); // useAuth로부터 필요한 값 가져오기
    const [newNickname, setNewNickname] = useState(''); // 새 닉네임 입력 상태 추가


    // 로그아웃 버튼을 누를 시
    const handleLogout = () => {
        try {
            // AuthContext에서 logout() 함
            logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
        navigate('/');
    };



    // 드롭다운 내에서 이름을 바꿀 시 변경될 코드
    const handleNicknameChange = async () => {
        console.log(userId, nickname, newNickname)
        try {
            // 서버로 새 닉네임을 업데이트하는 요청을 보냄
            const response = await fetch(`http://localhost:8080/api/users/me/nickname`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname:newNickname }),  // 수정: 새로운 닉네임과 사용자 ID를 보냄
                credentials: 'include' // 쿠키를 포함하여 요청

            });

            console.log(response.ok)
            
            if (response.ok) {
                // 응답이 성공적으로 받아졌다면
                const data = await response.text();
                console.log(data);
                // 새로운 닉네임을 설정합니다.
                setNickname(newNickname);
                setNewNickname('');
                setIsDropdownOpen(false);
            } else {
                console.error('Failed to update nickname on the server');
            }
        } catch (error) {
            console.error('Error updating nickname:', error);
        }
    };
    

    // 드롭다운 Open Close 코드
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);             
    };

    // 외부 클릭시 드롭다운 Close 코드
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <h2>내 정보</h2>
            {isLogin && (
                <React.Fragment>
                    <p>아이디: {userId}</p>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <p>닉네임: {nickname} <button onClick={toggleDropdown}>▼</button></p>
                        {isDropdownOpen && (
                            <div ref={dropdownRef} style={{
                                position: 'absolute',
                                right: 0,
                                backgroundColor: '#f1f1f1',
                                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                zIndex: 1,
                                padding: '10px'
                            }}>
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                    placeholder="새 닉네임"
                                    style={{ marginBottom: '10px' }}
                                />
                                <button onClick={handleNicknameChange}>닉네임 변경</button>
                            </div>
                        )}
                    </div>
                </React.Fragment>
            )}

            <h2>내가 쓴 글</h2>
            {/* 내가 쓴 글 목록 출력 코드 */}
            
            <button onClick={handleLogout}>로그아웃</button>
            
        </div>
    );
};

export default MyPage;
