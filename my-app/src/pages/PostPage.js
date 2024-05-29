import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostPage = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);

        // 게시글 데이터 가져오기
        let postEndpoint = '';
        if (id.startsWith('/api/jayuposts/')) {
          postEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
        } else if (id.startsWith('g')) {
          postEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        }

        const postResponse = await fetch(postEndpoint);
        if (!postResponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await postResponse.text();
        setPost(postData);

        // 미구현 - 댓글 데이터 가져오기
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async () => {
    // 댓글 추가 로직
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <div>
        <h2>댓글</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        ></textarea>
        <button onClick={handleAddComment}>댓글 추가</button>
        <div>
          {comments.map((c) => (
            <div key={c.id}>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
