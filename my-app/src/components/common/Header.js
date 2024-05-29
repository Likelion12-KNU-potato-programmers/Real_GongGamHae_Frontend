// 상단 헤더 고정 컴포넌트
import React, { useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { isLogin, userId, nickname } = useAuth();
    const navigate = useNavigate();
    
    // 로그인 안되어 있으면 자동으로 로그인 페이지 이동
    useEffect(() => {
        if (!isLogin) {
            navigate('/loginPage');
        }
    }, [isLogin, navigate]);

    // 상단에 메인페이지 이동 버튼 , 추후 추가
    const handleLogoClick = () => {
        navigate('/');
    };

    // 마이페이지 이동 버튼
    const handleMyPageClick = () => {
        navigate('/mypage');
    };

    return (
        <header>
            <div className="logo" onClick={handleLogoClick}>
                감자
            </div>
            <nav>
                {isLogin ? (
                    <React.Fragment>
                        <span>반갑습니다, {`${userId}(${nickname})님`} </span>
                        <button onClick={handleMyPageClick}>마이페이지</button>
                    </React.Fragment>
                ) : (
                    null // 로그인이 되어있지 않은 경우에는 아무것도 렌더링하지 않음
                )}
            </nav>
        </header>
    );
};

export default Header;
