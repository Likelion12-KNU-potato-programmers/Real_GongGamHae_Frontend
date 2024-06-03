import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import { useAuth } from '../components/Auth/AuthContext';
import '../css/MainPage.css'



import Side from '../components/common/side';



const categories = ['자유게시판', '공감게시판', 'BEST게시판'];

const MainPage = () => {
    const { isLogin, userCategory, updateCategory } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('자유게시판');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryEndpoint, setCategoryEndpoint] = useState('jayuposts');
    const [endpoint, setEndpoint] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 10;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let endpoint = '';
                if (selectedCategory === '자유게시판') {
                    endpoint = 'jayuposts';
                } else if (selectedCategory === '공감게시판') {
                    endpoint = 'gonggamposts';
                } else if (selectedCategory === 'BEST게시판') {
                    endpoint = 'gonggamposts';
                }

                
                const response = await fetch(`http://localhost:8080/api/${endpoint}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                let data = await response.json();

                if (selectedCategory === 'BEST게시판') {
                    console.log(data)
                    data = data.filter(post => post.likes >= 1);
                }

                // Sort posts by createdAt in descending order
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


                setPosts(data);
                setLoading(false);
                setCategoryEndpoint(endpoint);
                setEndpoint(endpoint);
                updateCategory(selectedCategory);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate indexes for posts to display based on current page
    const indexOfLastPost = (currentPage + 1) * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);



    if (selectedCategory == '자유게시판') {
        return (
            <div className="main-container">
                <Header />
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
                
                <div className='post-body'>
                    <h1 className="main-title">{selectedCategory}</h1>
    
                        {loading ? (
                            <p>Loading...</p>
                        ) : currentPosts.length === 0 ? (
                            <p>No posts found for selected category</p>
                        ) : (
                            <div>
                                <ul className="posts-list">
                                    {currentPosts.map((post) => (
                                        <li key={post.id} className="post-item">
                                            <div className="post-non-image">
                                                <Link to={`/api/${categoryEndpoint}/${post.id}`} className="post-link">
                                                    <h2 className="post-title">{post.title}</h2>
                                                </Link>
                                                <div className="post-texts">
                                                    <p className="post-content">{post.content}</p>
                                                    <div className="post-datails">
                                                        <p className="post-author">작성자: {post.userInfo.userAccount}</p>
                                                        <p className="post-comment-count">댓글 수: {post.commentCount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="post-image">
                                                <img src={post.imageUrl}/>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {/* Pagination */}
                                <div className="pagination">
                                    {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                                        <button key={index} onClick={() => handlePageChange(index)}>{index + 1}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isLogin && (
                            <Link to={`/PostWritePage/${categoryEndpoint}`} className="write-link">글쓰기</Link>
                        )}

                                    <aside className="sidebar">
                                        <Side />
                                    </aside>
                    </div>
                </div>
                
        );
    }
    else if (selectedCategory == '공감게시판') {
        return (
            <div className="main-container">
                <Header />
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
                <h1 className="main-title">{selectedCategory}</h1>
    
                {loading ? (
                    <p>Loading...</p>
                ) : currentPosts.length === 0 ? (
                    <p>No posts found for selected category</p>
                ) : (
                    <div>
                    <ul className="posts-list">
                        {posts.map((post) => (
                            <li key={post.id} className="post-item">
                                <div className="post-non-image">
                                    <Link to={`/api/${categoryEndpoint}/${post.id}`} className="post-link">
                                        <h2 className="post-title">{post.title}</h2>
                                    </Link>
                                    <div className="post-texts">
                                        <p className="post-content">{post.content}</p>
                                        <div className="post-datails">
                                            <p className="post-author">작성자: {post.userInfo.userAccount}</p>
                                            <p className="post-comment-count">댓글 수: {post.commentCount}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-image">
                                    <img src={post.imageUrl}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Pagination */}
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => handlePageChange(index)}>{index + 1}</button>
                        ))}
                    </div>
                    </div>
                )}

                {isLogin && (
                    <Link to={`/PostWritePage/${categoryEndpoint}`} className="write-link">글쓰기</Link>
                )}

                            <aside className="sidebar">
                                <Side />
                            </aside>
            </div>
        );
    } 
    else if (selectedCategory == 'BEST게시판') {
        return (
            <div className="main-container">
                <Header />
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
                <h1 className="main-title">{selectedCategory}</h1>
               
    
                {loading ? (
                    <p>Loading...</p>
                ) : currentPosts.length === 0 ? (
                    <p>No posts found for selected category</p>
                ) : (
                    <div>
                    <ul className="posts-list">
                        {posts.map((post) => (
                            <li key={post.id} className="post-item">
                                <div className="post-non-image">
                                    <Link to={`/api/${categoryEndpoint}/${post.id}`} className="post-link">
                                        <h2 className="post-title">{post.title}</h2>
                                    </Link>
                                    <div className="post-texts">
                                        <p className="post-content">{post.content}</p>
                                        <div className="post-datails">
                                            <p className="post-author">작성자: {post.userInfo.userAccount}</p>
                                            <p className="post-comment-count">댓글 수: {post.commentCount}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-image">
                                    <img src={post.imageUrl}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Pagination */}
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => handlePageChange(index)}>{index + 1}</button>
                        ))}
                    </div>
                    </div>
                )}
    
                <aside className="sidebar">
                    <Side />
                </aside>
            </div>
        );
    }
};

export default MainPage;
