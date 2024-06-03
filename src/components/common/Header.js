import React, { useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import myPageImage from '../../image/mypageIcon.png'; // 이미지 파일 가져오기

import '../../css/Header.css';

const Header = () => {
    const { isLogin, userId, nickname } = useAuth();
    const navigate = useNavigate();
    
    // 로그인 안되어 있으면 자동으로 로그인 페이지 이동
    useEffect(() => {
        if (!isLogin) {
            navigate('/loginPage');
        }
    }, [isLogin, navigate]);

    // 마이페이지 이동 버튼
    const handleMyPageClick = () => {
        navigate('/mypage');
    };

    // 로고 클릭 시 메인 페이지로 이동 기능 추가 필요!!! : 왜 안되는지 모르겠음
    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-left" onClick={handleLogoClick}>
                <span className="logo-text">공대 감성 판별해드립니다<br/>
                줄여서 공.감.해.</span>
            </div>
            <div className="header-center">
                <span className="logo-text2">공감해... 공감하라고...</span>
            </div>
            {isLogin && (
                <nav className="header-right">
                    <span>반갑습니다, {`${userId}(${nickname})님`} </span>
                    <button onClick={handleMyPageClick} className="mypage-button">
                        <img src={myPageImage} alt="마이페이지" class="resized-image"/> {/* 이미지로 대체 */}
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;
