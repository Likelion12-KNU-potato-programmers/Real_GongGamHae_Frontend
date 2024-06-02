import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';

const PostWrite = () => {
    const navigate = useNavigate();
    const { isLogin, userId, userCategory } = useAuth();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Check login status and set initialized to true after checking
        if (!isLogin) {
            navigate('/loginpage');
        } else {
            setInitialized(true);
        }
    }, [isLogin, navigate]);

    useEffect(() => {
        if (id && initialized) {
            const fetchPost = async () => {
                try {
                    let postEndpoint = '';
                    if (userCategory === '자유게시판') {
                        postEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
                    } else if (userCategory === '공감게시판') {
                        postEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
                    } else if (userCategory === 'bestposts') {
                        postEndpoint = `http://localhost:8080/api/bestposts/${id}`;
                    } else {
                        throw new Error(`Invalid category: ${userCategory}`);
                    }

                    const response = await fetch(postEndpoint);
                    if (!response.ok) {
                        throw new Error('Failed to fetch post');
                    }
                    const postData = await response.json();
                    setTitle(postData.title);
                    setContent(postData.content);
                } catch (error) {
                    setError(error.message);
                }
            };

            fetchPost();
        }
    }, [id, userCategory, initialized]);

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !content) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        let postEndpoint = ''; 
        let method = 'POST';

        if (id) {
            method = 'PUT';
            if (userCategory === '자유게시판') {
                postEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
            } else if (userCategory === '공감게시판') {
                postEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
            } else if (userCategory === 'bestposts') {
                postEndpoint = `http://localhost:8080/api/bestposts/${id}`;
            } else {
                setError('유효하지 않은 카테고리입니다.');
                setLoading(false);
                return;
            }
        } else {
            if (userCategory === '자유게시판') {
                postEndpoint = `http://localhost:8080/api/jayuposts`;
            } else if (userCategory === '공감게시판') {
                postEndpoint = `http://localhost:8080/api/gonggamposts`;
            } else {
                setError('유효하지 않은 카테고리입니다.');
                setLoading(false);
                return;
            }
        }

        console.log(postEndpoint)

        const formData = new FormData();
        const post = new Blob([JSON.stringify({ title: title, content: content })], {
            type: 'application/json',
        });
        formData.append('post', post);
        formData.append('imageFile', imageFile);
        
        try {
            const response = await fetch(postEndpoint, {
                method: method,
                body: formData,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to ${id ? 'update' : '1create'} post`);
            }

            const postData = await response.text();
            console.log('Post submitted successfully:', postData);

            setSuccess(`글이 성공적으로 ${id ? '수정' : '제출'}되었습니다.`);
            navigate('/');
        } catch (error) {
            setError(error.message);
            console.error('Error submitting post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>{id ? '글 수정' : '글쓰기'}</h1>
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>{success}</div>}
                
                <div>
                    <label>제목:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <div>
                    <label>이미지:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '제출 중...' : id ? '수정하기' : '글쓰기'}
                </button>
            </form>
        </div>
    );
};

export default PostWrite;