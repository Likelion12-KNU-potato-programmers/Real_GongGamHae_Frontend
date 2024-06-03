import React, { useState, useEffect } from 'react';

const Side = () => {
  const [bestPosts, setBestPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [sidePosts, setSidePosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    
    // const fetchBestPosts = async () => {
    //   try {
    //     const bestpostEndpoint = `http://localhost:8080/api/gonggamposts/best`;
    //     const response = await fetch(bestpostEndpoint, { credentials: 'include' });
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch best posts');
    //     }
    //     const data = await response.json();
    //     console.log(data,1111)
    //     setBestPosts(data);
    //   } catch (error) {
    //     setError(error.message);
    //   }
    // };

    const fetchSidePosts = async () => {
        try {
          const sidepostEndpoint = 'http://localhost:8080/api/gonggamposts/sideposts';
          const response = await fetch(sidepostEndpoint, { credentials: 'include' });
          if (!response.ok) {
            throw new Error('Failed to fetch side posts');
          }
          const data = await response.json();
          
        //   console.log(data,2222)

          data.forEach(item => {
            if (item.category === 'recentPosts') {
              setRecentPosts(item.posts);
            } else if (item.category === 'bestPosts') {
              setBestPosts(item.posts);
            }
          });
        } catch (error) {
          setError(error.message);
        }
      };
    //   fetchBestPosts();
      fetchSidePosts();
    }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Best Posts</h2>
      <ul>
        {bestPosts.map((post) => (
          <li key={post.id}>
            <a href={`/api/gonggamposts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>

      <h2>Recent Posts</h2>
      <ul>
        {recentPosts.map((post) => (
          <li key={post.id}>
            <a href={`/api/gonggamposts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Side;
