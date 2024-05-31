import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지 모음
import PostPage from './pages/PostPage';      // 게시글 내용 페이지
import MainPage from './pages/MainPage';      // 메인 페이지
import PostWritePage from './pages/PostWritePage';    // 게시글 쓰기 페이지
import LoginPage from './pages/LoginPage';    // 로그인 페이지
import RegisterPage from './pages/RegisterPage';    // 회원가입 페이지
import MyPage from './pages/MyPage';          // 마이페이지


// AuthProvider로 로그인 상태 관리
import AuthProvider from './components/Auth/AuthContext';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/api/:category/:id" element={<PostPage />} />
          {/* <Route path="/api/jayuposts/:id" element={<PostPage />} />
          <Route path="/api/gonggamposts/:id" element={<PostPage />} /> */}

          <Route path="/PostWritePage/jayuposts" element={<PostWritePage />} /> 
          <Route path="/PostWritePage/gonggamposts" element={<PostWritePage />} /> 
          

          <Route path="/PostWritePage/jayupost/:id" element={<PostWritePage />} /> 
          <Route path="/PostWritePage/gonggampost/:id" element={<PostWritePage />} /> 

          <Route path='/LoginPage' element={<LoginPage />} />
          <Route path='/RegisterPage' element={<RegisterPage />} />
          <Route path='/MyPage' element={<MyPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
