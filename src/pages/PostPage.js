import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';

import Header from '../components/common/Header';

import '../css/PostPage.css'; // CSS 파일 가져오기


const PostPage = () => {
  const { id } = useParams(); // 'category' 대신 'id'만 사용
  const { isLogin, userId, userCategory } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [warning, setWarning] = useState('');




  // 최포 포스트 불러오기
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        console.log(userCategory)
        console.log(userId)
        let postEndpoint = '';
        if (userCategory === '자유게시판') {
          postEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
        } else if (userCategory === '공감게시판') {
          postEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        } else if (userCategory === 'BEST게시판') {
          postEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        } else {
          throw new Error(`Invalid category: ${userCategory}`);
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

    const likes = async () => {
      
    };
    
    const dislikes = async () => {

    };

    likes();
    dislikes();
    fetchPostAndComments();
  }, [id, userCategory]);
  
  
  // 댓글 작성
  const handleAddComment = async () => {
    if (!comment) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      let commentsEndpoint = '';
      if (userCategory === '자유게시판') {
        commentsEndpoint = `http://localhost:8080/api/jayucomments/${id}`;
      } else if (userCategory === '공감게시판') {
        commentsEndpoint = `http://localhost:8080/api/gonggamcomments/${id}`;
      } else if (userCategory === 'BEST게시판') {
        commentsEndpoint = `http://localhost:8080/api/gonggamcomments/${id}`;
      } else {
        throw new Error(`Invalid category: ${userCategory}`);
      }
      const response = await fetch(commentsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
        credentials: 'include',
      });

      if (!response.ok) {
        alert("권한이 없습니다.")
        return 
      }

      const newComment = await response.json();
      setComments([...comments, newComment]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.message);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentContent) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      let updateEndpoint = '';
      if (userCategory === '자유게시판') {
        updateEndpoint = `http://localhost:8080/api/jayucomments/${id}/${commentId}`;
      } else if (userCategory === '공감게시판') {
        updateEndpoint = `http://localhost:8080/api/gonggamcomments/${id}/${commentId}`;
      } else if (userCategory === 'BEST게시판') {
        updateEndpoint = `http://localhost:8080/api/gonggamcomments/${id}/${commentId}`;
      } else {
        throw new Error(`Invalid category: ${userCategory}`);
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
        alert("권한이 없습니다.")
        return 
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
      } else if (userCategory === 'BEST게시판') {
        deleteEndpoint = `http://localhost:8080/api/gonggamcomments/${id}/${commentId}`;
      } else {
        throw new Error(`Invalid category: ${userCategory}`);
      }

      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        alert("권한이 없습니다.")
        return 
      }


      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError(error.message);
    }
  };





  // 포스트 수정
  const handleUpdatePost = async () => {
    try {
        let editEndpoint = '';
        if (userCategory === '자유게시판') {
            editEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
        } else if (userCategory === '공감게시판') {
            editEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        } else if (userCategory === 'BEST게시판') {
            editEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        } else {
            console.error('Invalid category:', userCategory);
            return;
        }

        const response = await fetch(editEndpoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post for verification');
        }

        console.log(editEndpoint)
        const postData = await response.json();
        console.log(postData)
        console.log(userId)

        // Check if the logged-in user is the author
        if (postData.userInfo.userAccount !== userId) {
            alert("수정 권한이 없습니다.");
            return;
        }

        // Navigate to the edit page
        if (userCategory === '자유게시판') {
          navigate(`/postWritePage/jayupost/${id}`);
        } else if (userCategory === '공감게시판') {
          navigate(`/postWritePage/gonggampost/${id}`);
        } else if (userCategory === 'BEST게시판') {
          navigate(`/postWritePage/gonggampost/${id}`);
        } else {
            console.error('Invalid category:', userCategory);
            return;
        }
        

    } catch (error) {
        setError(error.message);
        console.error('Error updating post:', error);
    }
};




// 추천 핸들러
const handleLike = async () => {
  try {
    // Send a request to your backend API to indicate that the post has been recommended
    const response = await fetch(`http://localhost:8080/api/gonggamposts/${post.id}/like`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    console.log(response.ok)
    // Check if the recommendation was successful
    if (response.ok) {
      // Handle success
      alert('포스트가 추천되었습니다.');
    } else {
      // Handle failure
      // likes()
      alert('포스트 추천에 실패했습니다.');
    }
  } catch (error) {
    // Handle error
    console.error('Error recommending post:', error);
    alert('오류가 발생했습니다.');
  }
};

// 비추천 핸들러
const handleDisLike = async () => {
  try {
    // Send a request to your backend API to indicate that the post has been recommended
    const response = await fetch(`http://localhost:8080/api/gonggamposts/${post.id}/dislike`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // Check if the recommendation was successful
    if (response.ok) {
      // Handle success
      // dislikes();
      alert('포스트가 비추천되었습니다.');
    } else {
      // Handle failure
      alert('포스트 비추천에 실패했습니다.');
    }
  } catch (error) {
    // Handle error
    console.error('Error recommending post:', error);
    alert('오류가 발생했습니다.');
  }
};





// 포스트 삭제
  const handleDeletePost = async () => {
    try {
        let deleteEndpoint = '';
        if (userCategory === '자유게시판') {
            deleteEndpoint = `http://localhost:8080/api/jayuposts/${id}`;
        } else if (userCategory === '공감게시판') {
            deleteEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        } else if (userCategory === 'BEST게시판') {
            deleteEndpoint = `http://localhost:8080/api/gonggamposts/${id}`;
        } else {
            throw new Error(`Invalid category: ${userCategory}`);
        }

        // Fetch the post to check the author
        const postResponse = await fetch(deleteEndpoint);
        if (!postResponse.ok) {
            throw new Error('Failed to fetch post for verification');
        }
        const postData = await postResponse.json();

        console.log(postData.userInfo.userid)
        console.log(userId)
        // Check if the logged-in user is the author
        if (postData.userInfo.userAccount !== userId) {
            alert('자신의 포스트만 삭제할 수 있습니다.');
            return;
        }

        // Proceed with deletion if the user is the author
        const response = await fetch(deleteEndpoint, {
            method: 'DELETE',
        });

        if (response.ok) {
            // 삭제가 성공했을 경우 알림을 띄우고 삭제를 진행
            alert('삭제되었습니다');
            // 삭제 후 필요한 작업 수행
            navigate('/'); // Navigate to the home page after deletion
        } else {
            // 삭제가 실패했을 경우 적절한 에러 처리
            throw new Error('Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('삭제 권한이 없습니다');
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


  if (userCategory == '자유게시판') {
    return (
      <div className="post-container">
          <Header />
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          {post.imageUrl && (
          <img src={post.imageUrl} alt="Post" className="post-image" />
          )}

          <div className="comment-container">
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
                      <div key={c.id} className="comment">
                          <img src={c.user.profileImageUrl} alt="Profile" className="profile-image" />
                          {editingCommentId === c.id ? (
                              <div>
                                  <textarea
                                      value={editingCommentContent}
                                      onChange={(e) => setEditingCommentContent(e.target.value)}
                                      placeholder="댓글을 수정하세요"
                                  ></textarea>
                                  <div className="comment-buttons">
                                      <button className="edit-button" onClick={() => handleUpdateComment(c.id)}>저장</button>
                                      <button onClick={() => setEditingCommentId(null)}>취소</button>
                                  </div>
                              </div>
                          ) : (
                              <div>
                                  <p>{c.content} {c.user.userAccount}</p>
                                  <div className="comment-buttons">
                                      <button className="edit-button" onClick={() => {
                                          setEditingCommentId(c.id);
                                          setEditingCommentContent(c.content);
                                      }}>수정</button>
                                      <button className="delete-button" onClick={() => handleDeleteComment(c.id)}>삭제</button>
                                  </div>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </div>
    );
    // 
  } else if (userCategory == '공감게시판') {
    return (
      <div className="post-container">
        <Header />
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post" className="post-image" />
        )}
    
        {/* Recommendation button */}
        {post.likes}
        <button onClick={handleLike}>추천</button>
        {post.dislikes}
        <button onClick={handleDisLike}>비추천</button>
    
        <div className="comment-container">
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
              <div key={c.id} className="comment">
                <img src={c.user.profileImageUrl} alt="Profile" className="profile-image" />
                {editingCommentId === c.id ? (
                  <div>
                    <textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      placeholder="댓글을 수정하세요"
                    ></textarea>
                    <div className="comment-buttons">
                      <button className="edit-button" onClick={() => handleUpdateComment(c.id)}>저장</button>
                      <button onClick={() => setEditingCommentId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>{c.content} {c.user.userAccount}</p>
                    <div className="comment-buttons">
                      <button className="edit-button" onClick={() => {
                        setEditingCommentId(c.id);
                        setEditingCommentContent(c.content);
                      }}>수정</button>
                      <button className="delete-button" onClick={() => handleDeleteComment(c.id)}>삭제</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );    
  }
  else if (userCategory == 'BEST게시판') {
    return (
      <div className="post-container">
        <Header />
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post" className="post-image" />
        )}
    
        {/* Recommendation button */}
        {post.likes}
        <button onClick={handleLike}>추천</button>
        {post.dislikes}
        <button onClick={handleDisLike}>비추천</button>
    
        <div className="comment-container">
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
              <div key={c.id} className="comment">
                <img src={c.user.profileImageUrl} alt="Profile" className="profile-image" />
                {editingCommentId === c.id ? (
                  <div>
                    <textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      placeholder="댓글을 수정하세요"
                    ></textarea>
                    <div className="comment-buttons">
                      <button className="edit-button" onClick={() => handleUpdateComment(c.id)}>저장</button>
                      <button onClick={() => setEditingCommentId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>{c.content} {c.user.userAccount}</p>
                    <div className="comment-buttons">
                      <button className="edit-button" onClick={() => {
                        setEditingCommentId(c.id);
                        setEditingCommentContent(c.content);
                      }}>수정</button>
                      <button className="delete-button" onClick={() => handleDeleteComment(c.id)}>삭제</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );    
  };
}


export default PostPage;