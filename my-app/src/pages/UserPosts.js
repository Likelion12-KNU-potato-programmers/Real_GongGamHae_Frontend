// src/pages/UserPosts.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import { useAuth } from '../components/Auth/AuthContext';
import '../css/UserPosts.css';

const UserPosts = ({ userId }) => {
    const { isLogin } = useAuth(); // 로그인 상태 가져오기
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${userId}/posts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user posts');
                }

                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [userId]);

    if (!isLogin) {
        return <p>Please log in to see your posts.</p>;
    }

    return (
        <div className="user-posts-container">
            <Header />
            <h1 className="user-posts-title">내가 쓴 글</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : posts.length === 0 ? (
                <p>No posts found</p>
            ) : (
                <ul className="posts-list">
                    {posts.map((post) => (
                        <li key={post.id} className="post-item">
                            <Link to={`/api/${post.category}/${post.id}`} className="post-link">
                                <h2 className="post-title">{post.title}</h2>
                                <p className="post-content">{post.content}</p>
                                <p className="post-author">작성자: {post.userInfo.nickname}</p>
                                <p className="post-comment-count">댓글 수: {post.commentCount}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserPosts;
