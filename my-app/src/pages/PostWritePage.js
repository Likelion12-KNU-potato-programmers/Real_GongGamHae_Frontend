import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';

const PostWrite = () => {
    const navigate = useNavigate();
    const { isLogin, userId, userCategory } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

        let postEndpoint = ''; // 게시판에 따라 endpoint 선택
        if (userCategory === '자유게시판') {
            postEndpoint = `http://localhost:8080/api/jayuposts`;
        } else if (userCategory === '공감게시판') {
            postEndpoint = `http://localhost:8080/api/gonggamposts`;
        } else {
            setError('유효하지 않은 카테고리입니다.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('post', JSON.stringify({ title, content })); // Append JSON representation of post
        if (imageFile) {
            formData.append('imageFile', imageFile, imageFile.name);
        }

        try {
            const postResponse = await fetch(postEndpoint, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (!postResponse.ok) {
                throw new Error('Failed to fetch post');
            }
            const postData = await postResponse.json();
            console.log('Post submitted successfully:', postData);
        
            setSuccess('글이 성공적으로 제출되었습니다.');
            navigate('/');
        } catch (error) {
            setError(error.message);
            console.error('Error submitting post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isLogin) {
        navigate('/login');
        return null;
    }

    return (
        <div>
            <h1>글쓰기</h1>
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
                    {loading ? '제출 중...' : '글쓰기'}
                </button>
            </form>
        </div>
    );
};

export default PostWrite;
