import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';

const PostPage = () => {
  const { category, id } = useParams();
  const { user, userCategory } = useAuth(); // useAuth to get user details and category
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [warning, setWarning] = useState('');

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
      let commentsEndpoint = '';
      if (userCategory === '자유게시판') {
        commentsEndpoint = `http://localhost:8080/api/jayucomments/${id}`;
      } else if (userCategory === '공감게시판') {
        commentsEndpoint = `http://localhost:8080/api/gonggamcomments/${id}`;
      } else if (userCategory === 'bestposts') {
        commentsEndpoint = `http://localhost:8080/api/bestcomments/${id}`;
      } else {
        throw new Error(`Invalid category: ${category}`);
      }
      const response = await fetch(commentsEndpoint, {
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

  const handleUpdateComment = async (commentId) => {
    try {
      let updateEndpoint = '';
      if (userCategory === '자유게시판') {
        updateEndpoint = `http://localhost:8080/api/jayucomments/${id}/${commentId}`;
      } else if (userCategory === '공감게시판') {
        updateEndpoint = `http://localhost:8080/api/gonggamcomments/${id}/${commentId}`;
      } else if (userCategory === 'bestposts') {
        updateEndpoint = `http://localhost:8080/api/bestcomments/${id}/${commentId}`;
      } else {
        throw new Error(`Invalid category: ${category}`);
      }

      const response = await fetch(updateEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editingCommentContent }),
        credentials: 'include',
      });

      if (!response.ok) {
        alert('수정 권한이 없습니다');
        return;
      }

      const updatedComment = await response.json();
      setComments(comments.map((c) => (c.id === commentId ? updatedComment : c)));
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
      setError(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      let deleteEndpoint = '';
      if (userCategory === '자유게시판') {
        deleteEndpoint = `http://localhost:8080/api/jayucomments/${id}/${commentId}`;
      } else if (userCategory === '공감게시판') {
        deleteEndpoint = `http://localhost:8080/api/gonggamcomments/${id}/${commentId}`;
      } else if (userCategory === 'bestposts') {
        deleteEndpoint = `http://localhost:8080/api/bestcomments/${id}/${commentId}`;
      } else {
        throw new Error(`Invalid category: ${category}`);
      }

      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        alert('삭제 권한이 없습니다');
        return;
      }

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError(error.message);
    }
  };

  const handleUpdatePost = async () => {
    try {
      let editPage = '';
      if (userCategory === '자유게시판') {
        editPage = `/PostWritePage/jayupost/${id}`;
      } else if (userCategory === '공감게시판') {
        editPage = `/PostWritePage/gonggampost/${id}`;
      } else if (userCategory === 'bestposts') {
        editPage = `/PostWritePage`;
      } else {
        console.error('Invalid category:', userCategory);
        return;
      }
  
      // Fetch the post to check the author
      const postResponse = await fetch(editPage);
      if (!postResponse.ok) {
        throw new Error('Failed to fetch post for verification');
      }
      const postData = await postResponse.text();
  
      // Check if the logged-in user is the author
      if (postData.authorId !== user.id) {
        // alert('수정 권한이 없습니다');
        return;
      }
  
      // Navigate to the edit page
      navigate(editPage);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('수정 권한이 없습니다');
      return;
    }
  };
  

  const handleDeletePost = async () => {
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
  
      // Fetch the post to check the author
      const postResponse = await fetch(deleteEndpoint);
      if (!postResponse.ok) {
        throw new Error('Failed to fetch post for verification');
      }
      const postData = await postResponse.json();
  
      // Check if the logged-in user is the author
      if (postData.authorId !== user.id) {
        setWarning('You can only delete your own posts');
        return;
      }
  
      // Proceed with deletion if the user is the author
      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
  
      navigate('/'); // Navigate to the home page after deletion
    } catch (error) {
      alert('삭제 권한이 없습니다');
      return;
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
              {editingCommentId === c.id ? (
                <div>
                  <textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    placeholder="댓글을 수정하세요"
                  ></textarea>
                  <button onClick={() => handleUpdateComment(c.id)}>저장</button>
                  <button onClick={() => setEditingCommentId(null)}>취소</button>
                </div>
              ) : (
                <div>
                  <p>{c.content} {c.user.userid}</p>
                  <button onClick={() => {
                    setEditingCommentId(c.id);
                    setEditingCommentContent(c.content);
                  }}>수정</button>
                  <button onClick={() => handleDeleteComment(c.id)}>삭제</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
