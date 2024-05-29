import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';

const PostWrite = () => {
    const navigate = useNavigate();
    const { isLogin, userId } = useAuth();

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
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
    
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/jayuposts', {
                method: 'POST',
                body: formData,
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error('글을 제출하는데 실패했습니다.');
            }
    
            const result = await response.json();
            setSuccess('글이 성공적으로 제출되었습니다.');
            console.log('Post submitted successfully:', result);
    
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
