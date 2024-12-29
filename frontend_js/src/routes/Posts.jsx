import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { nickname, userID } = useParams();
  const navigate = useNavigate();

  const capitalizedNickname = nickname ? nickname.charAt(0).toUpperCase() + nickname.slice(1) : '';

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userID) {
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }
      try {
        const apiUrl = `${import.meta.env.VITE_RETRIEVE_POST_BY_USERID}/get?type=post&userId=${userID}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [userID]);

  const handlePostClick = (postId) => {
    if (postId) {
      navigate(`/details/${postId}`);
    }
  };

  if (isLoading) {
    return <div className="p-5 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-5 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">{capitalizedNickname}'s Projects</h2>
      <div className="space-y-4">
        {posts.map((post) => {
          const postId = post.postID || post.post_id || post.id;
          return (
            <div
              key={postId}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4">
                <h3 className="text-xl font-medium mb-3">{post.title}</h3>
                <div 
                  className="text-gray-600 overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5em',
                    maxHeight: '4.5em'
                  }}
                >
                  {post.content}
                </div>
                <div className="mt-3 flex gap-6 items-center">
                  <button
                    onClick={() => handlePostClick(postId)}
                    className="h-8 px-4 text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500 rounded-md transition-colors duration-200"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {posts.length === 0 && (
          <div className="text-center text-gray-500">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;