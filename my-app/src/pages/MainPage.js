import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import { useAuth } from '../components/Auth/AuthContext';
import '../css/MainPage.css'
const categories = ['자유게시판', '공감게시판', 'BEST게시판'];

const MainPage = () => {
    const { isLogin, userCategory, updateCategory } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('자유게시판');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryEndpoint, setCategoryEndpoint] = useState('jayuposts');
    const [endpoint, setEndpoint] = useState('');

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
                setEndpoint(endpoint);
                updateCategory(selectedCategory);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(selectedCategory);
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="main-container">
            <Header />
            <h1 className="main-title">메인 페이지</h1>
            <div className="categories-container">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {isLogin && (
                <Link to={`/PostWritePage/${categoryEndpoint}`} className="write-link">글쓰기</Link>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : posts.length === 0 ? (
                <p>No posts found for selected category</p>
            ) : (
                <ul className="posts-list">
                    {posts.map((post) => (
                        <li key={post.id} className="post-item">
                            <Link to={`/api/${categoryEndpoint}/${post.id}`} className="post-link">
                                <h2 className="post-title">{post.title}</h2>
                                <p className="post-content">{post.content}</p>
                                <p className="post-author">작성자: {post.userInfo.userid}</p>
                                <p className="post-comment-count">댓글 수: {post.commentCount}</p>
                                <p className='post-image'> <img src={post.imageUrl}/> </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );    
};

export default MainPage;
