import React, { useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

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

    return (
        <header className="header">
            <div className="header-left">
                <span className="logo-text">감자</span>
            </div>
            {isLogin && (
                <nav className="header-right">
                    <span>반갑습니다, {`${userId}(${nickname})님`} </span>
                    <button onClick={handleMyPageClick} className="mypage-button">
                        마이페이지
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;
