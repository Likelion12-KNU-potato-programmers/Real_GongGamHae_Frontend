import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';

const PostPage = () => {
  const { category, id } = useParams();
  const { userCategory } = useAuth(); // useAuth로부터 category 받아오기

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        console.log(userCategory);

        let postEndpoint = '';
        if (userCategory === '자유게시판') {
          postEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
        } else if (userCategory === '공감게시판') {
          postEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        } else if (userCategory === 'bestposts') {
          postEndpoint = `http://localhost:8080/api/bestposts/${id}`;
        } else {
          throw new Error(`Invalid category: ${category}`);
        }

        const postResponse = await fetch(postEndpoint);
        if (!postResponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await postResponse.json();
        setPost(postData);
        setComments(postData.comments);

      } catch (error) {
        console.error('Error fetching post and comments:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [category, id]);

  const handleAddComment = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/jayucomments/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
        credentials: 'include',
      });
      
      console.log(response.ok)
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      setComments([...comments, newComment]); // 기존 댓글 리스트에 새 댓글 추가
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.message);
    }
  };

  const handleUpdatePost = async () => {
    // 포스트 수정 로직
    try {
      const updatedPost = {
        title: '새로운 제목', // 수정된 제목
        content: '새로운 내용', // 수정된 내용
      };

      let updateEndpoint = '';
      if (userCategory === '자유게시판') {
        updateEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
      } else if (userCategory === '공감게시판') {
        updateEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
      } else if (userCategory === 'bestposts') {
        updateEndpoint = `http://localhost:8080/api/bestposts/${id}`;
      } else {
        throw new Error(`Invalid category: ${category}`);
      }

      const response = await fetch(updateEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPostData = await response.json();
      setPost(updatedPostData);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    // 포스트 삭제 로직
    try {
      let deleteEndpoint = '';
      if (userCategory === '자유게시판') {
        deleteEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
      } else if (userCategory === '공감게시판') {
        deleteEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
      } else if (userCategory === 'bestposts') {
        deleteEndpoint = `http://localhost:8080/api/bestposts/${id}`;
      } else {
        throw new Error(`Invalid category: ${category}`);
      }

      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // 포스트가 성공적으로 삭제되면 이전 페이지로 이동하거나 특정한 액션을 수행할 수 있음
    } catch (error) {
      console.error('Error deleting post:', error);
    }
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
        <button onClick={handleUpdatePost}>포스트 수정</button>
        <button onClick={handleDeletePost}>포스트 삭제</button>
        <div>
          {comments.map((c) => (
            <div key={c.id}>
              <p>{c.content}       {c.user.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
