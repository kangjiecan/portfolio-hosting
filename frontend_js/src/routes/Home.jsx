import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [shareableLink, setShareableLink] = useState(null);
  const navigate = useNavigate();

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      throw new Error("Failed to decode JWT");
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }
    try {
      const decodedData = decodeJWT(accessToken);
      const userNickname = decodedData.nickname || decodedData.username;
      const userSub = decodedData.sub;
      setNickname(userNickname);
      setUserId(userSub);

      const shareableUrl = `${
        import.meta.env.VITE_APP_HOST
      }/posts/${encodeURIComponent(userNickname)}/${userSub}`;
      setShareableLink(shareableUrl);
      fetchUserPosts(userSub);
    } catch (err) {
      setError("Error processing user data");
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserPosts = async (userId) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_RETRIEVE_POST_BY_USERID
      }/get?type=post&userId=${userId}`;
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error("Failed to fetch user posts");
      }
      const posts = await res.json();
      setUserPosts(posts);
    } catch (err) {
      setError(`Error fetching posts: ${err.message}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert("Link copied to clipboard!");
    } catch (err) {
      setError("Failed to copy link");
    }
  };

  const handlePostClick = (postID) => {
    navigate(`/details/${postID}`);
  };

  const handleEditClick = (e, postID) => {
    e.stopPropagation();
    navigate(`/editpost/${postID}`, { state: { userId } });
  };

  // Function to truncate content
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="p-5 text-left">
      {nickname && userPosts && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {nickname}'s Projects
          </h2>
          {shareableLink && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                <p className="mb-0 font-semibold text-lg">
                  Share your projects with this link:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="px-3 py-2 border rounded-md w-64 text-sm bg-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-500 text-black hover:bg-blue-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {userPosts.map((post, index) => (
              <div
                key={post.postID || `post-${index}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <h3 className="text-xl font-medium mb-3">{post.title}</h3>
                  <div className="text-gray-600">
                    {truncateContent(post.content)}
                  </div>
                  <div className="mt-3 flex gap-6 items-center">
                    <button
                      onClick={() => handlePostClick(post.postID)}
                      className="px-4 py-0 text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500 rounded-md transition-colors duration-200"
                    >
                      Read More →
                    </button>
                    <button
                      onClick={(e) => handleEditClick(e, post.postID)}
                      className="px-4 py-0 bg-blue-500 text-black  hover:bg-blue-600 transition-colors duration-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;