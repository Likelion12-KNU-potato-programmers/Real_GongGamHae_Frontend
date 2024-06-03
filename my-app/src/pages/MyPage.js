import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext'; // useAuth 가져오기
import Header from '../components/common/Header';           // header 가져오기

import '../css/MyPage.css';

const MyPage = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);    // 닉네임 옆의 연필버튼의 드롭다운 on off 버튼
    const dropdownRef = useRef(null);                               // 찾아봐야함
    const navigate = useNavigate();
    const { isLogin, userId, nickname, logout, setNickname } = useAuth(); // useAuth로부터 필요한 값 가져오기
    const [newNickname, setNewNickname] = useState(''); // 새 닉네임 입력 상태 추가
    const [userPosts, setUserPosts] = useState([]); // State to store user's posts
    const [profileImageUrl, setProfileImageUrl] = useState(''); // 프로필 이미지 URL 상태 추가

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/me/posts`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const posts = await response.json();
                setUserPosts(posts);
            } else {
                console.error('Failed to fetch user posts');
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    // 유저 프로필 사진 불러오기
    const fetchUserProfileImage = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/me`, {
                method: 'GET',
                credentials: 'include'
            });

            console.log(response.ok)
            if (response.ok) {
                const profileImageUrl = await response.json();
                console.log(profileImageUrl.nickname, 111111);
                
                setProfileImageUrl(profileImageUrl.profileImage);
            } else {
                console.error('Failed to fetch profile image');
            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };

    useEffect(() => {
        fetchUserPosts();
        fetchUserProfileImage(); // 프로필 이미지를 가져오는 함수 호출
    }, []);

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
    
    // 프로필 이미지 업로드 처리
    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0]; // 선택된 이미지 파일 가져오기
        const formData = new FormData(); // FormData 객체 생성
        formData.append('profileImage', imageFile); // FormData에 이미지 파일 추가

        try {
            const response = await fetch(`http://localhost:8080/api/users/me/profile`, {
                method: 'PUT',
                body: formData,
                credentials: 'include' // 쿠키를 포함하여 요청
            });

          
            
            console.log(response.ok)
            if (response.ok) {
                // 이미지 업로드 성공 시 프로필 이미지 업데이트
                fetchUserProfileImage(); // 이미지 업로드 후 프로필 이미지를 다시 가져와서 상태를 업데이트
            } else {
                console.error('Failed to upload profile image');
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
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
        <div className="mypage-container">
            <Header />
            <h2>내 정보</h2>
            {isLogin && (
                <div className="user-info">
                    {profileImageUrl ? (
                        <img src={profileImageUrl} alt="Profile" className="profile-image" />
                    ) : (
                        <p>Loading profile image...</p>
                    )} {/* 프로필 이미지 추가 */}

                    <input type="file" accept="image/*" onChange={handleImageUpload} /> {/* 이미지 업로드 입력 필드 추가 */}
                    
                    <div className="user-details">
                        <div className="nickname-container">
                            <p className="nickname">
                                닉네임: {nickname}&nbsp;&nbsp;
                                <button onClick={toggleDropdown} className="edit-button">✏️</button>
                            </p>
                            {isDropdownOpen && (
                                <div ref={dropdownRef} className="dropdown-content">
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={(e) => setNewNickname(e.target.value)}
                                        placeholder="새 닉네임"
                                    />
                                    <button onClick={handleNicknameChange}>닉네임 변경</button>
                                </div>
                            )}
                        </div>
                        <p className="user-id">아이디: {userId}</p>
                    </div>
                </div>
            )}


            <h2>내가 쓴 글</h2>
            <ul className="posts-list">
                {userPosts.map(post => (
                    <li key={post.id}>
                        {post.title}
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>

            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default MyPage;
