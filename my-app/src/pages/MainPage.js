import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header'; // Header 컴포넌트 import
import { useAuth } from '../components/Auth/AuthContext'; // useAuth 훅 임포트

const categories = ['자유게시판', '공감게시판', 'BEST게시판'];

const MainPage = () => {
    const { isLogin } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('자유게시판');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryEndpoint, setCategoryEndpoint] = useState('jayuposts');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let endpoint = '';
                if (selectedCategory === '자유게시판') {
                    endpoint = 'jayuposts';
                } else if (selectedCategory === '공감게시판') {
                    endpoint = 'gonggamposts';
                } else if (selectedCategory === 'BEST게시판') {
                    endpoint = 'bestposts';
                }

                const response = await fetch(`http://localhost:8080/api/${endpoint}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
                setLoading(false);
                setCategoryEndpoint(endpoint);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div>
            <Header />
            <h1>메인 페이지</h1>
            <div style={{ marginBottom: '20px' }}>
                {categories.map(category => (
                    <button 
                        key={category} 
                        onClick={() => handleCategoryChange(category)} 
                        style={{ margin: '0 10px', fontWeight: selectedCategory === category ? 'bold' : 'normal' }}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {isLogin && <Link to="/PostWritePage">글쓰기</Link>}
            {loading ? (
                <p>Loading...</p>
            ) : posts.length === 0 ? (
                <p>No posts found for selected category</p>
            ) : (
                <ul>
                {posts.map(post => (
                    <li key={post.id}>
                    <Link to={`/${categoryEndpoint}/${post.id}`}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </Link>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
};

export default MainPage;
