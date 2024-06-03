import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext'; // useAuth 가져오기
import Header from '../components/common/Header';           // header 가져오기


import '../css/MyPage.css';

const MyPage = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);    // 닉네임 옆의 연필버튼의 드롭다운 on off 버튼
    const dropdownRef = useRef(null);                               // 찾아봐야함
    const navigate = useNavigate();
    const { isLogin, userId, nickname, logout, setNickname, updateCategory } = useAuth(); // useAuth로부터 필요한 값 가져오기
    const [newNickname, setNewNickname] = useState(''); // 새 닉네임 입력 상태 추가
    const [jayuPosts, setJayuPosts] = useState([]);
    const [gonggamPosts, setGonggamPosts] = useState([]);
    const [profileImageUrl, setProfileImageUrl] = useState(''); // 프로필 이미지 URL 상태 추가

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/me/posts`, {
            method: 'GET',
            credentials: 'include'
        });



        if (response.ok) {
            const posts = await response.json();
            
            console.log(posts)

            const jayu = posts.jayuPosts;
            const gonggam = posts.gonggamPosts;
            setJayuPosts(jayu);
            setGonggamPosts(gonggam);
            console.log(jayu)
            console.log(gonggam)

            } else {
                console.error('Failed to fetch Jayu posts');
            }

            
            // const gonggamResponse = await fetch(`http://localhost:8080/api/gonggamposts`, {
            //     method: 'GET',
            //     credentials: 'include'
            // });

            // if (gonggamResponse.ok) {
            //     const gonggamPosts = await gonggamResponse.json();
            //     const userGonggamPosts = filterPostsByUser(gonggamPosts);
            //     setGonggamPosts(userGonggamPosts);
            //     console.log(gonggamPosts)
            // } else {
            //     console.error('Failed to fetch Gonggam posts');
            // }


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

        console.log()
    }, []);

    // 로그아웃 버튼을 누를 시
    const handleLogout = () => {
        try {
            // AuthContext에서 logout() 함
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
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
    
              
                
                console.log(response.ok,2222)
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
    //http://localhost:3000/api/gonggamposts/4
    //http://localhost:3000/api/gonggamposts/5
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

    const handlePostClick = (category) => {
        // 선택한 포스트의 카테고리에 따라 updateCategory 호출
        updateCategory(category);
    };
    
    
    // // 포스트 클릭 시 리다이렉션 핸들러
    // const handlePostClick = (post) => {
    //     if (post.type === 'jayuposts') {
    //         console.log(`/api/jayuposts/${post.id}`);
    //         navigate(`/api/jayuposts/${post.id}`);
    //     } else if (post.type === 'gonggamposts') {
    //         console.log(`/api/gonggamposts/${post.id}`);
    //         navigate(`/api/gonggamposts/${post.id}`);
    //     }
    // };
    
    
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
                    <br/>
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

            <button className="logout-button" onClick={handleLogout}>로그아웃</button>

            <h2>커뮤니티</h2>
            <h2>Gonggam Posts</h2>
            <ul className="posts-list">
            
            {gonggamPosts.map(post1 => (
                <li className='post-item'>
                <li key={post1.id} onClick={() => handlePostClick('공감게시판')}>
                    <Link to={`/api/gonggamposts/${post1.id}`}>
                        <p className='post-title'>{post1.title}</p>
                        <p className='post-title'>{post1.createdAt}</p>
                        <br/>
                    </Link>
                </li>
                </li>
            ))}
            
        </ul>

        <h2>Jayu Posts</h2>
        <ul className="posts-list">
            {jayuPosts.map(post => (
                <li className='post-item'>
                <li key={post.id} onClick={() => handlePostClick('자유게시판')}>
                    <Link to={`/api/jayuposts/${post.id}`}>
                        <p className='post-title'>{post.title}</p>
                        <p className='post-title'>{post.createdAt}</p>
                        <br/>
                    </Link>
                </li>
                </li>
            ))}
        </ul>

        </div>
    );
};

export default MyPage;
