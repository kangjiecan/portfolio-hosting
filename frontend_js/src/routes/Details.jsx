import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

const Details = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        console.log('passed post id', postId);
        const apiUrl = `${import.meta.env.VITE_RETERIEVE_POST_BY_POSTID}${postId}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch post details');
        const postData = await res.json();
        setPost(Array.isArray(postData) ? postData[0] : postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId]);

  return (
    <div style={{ maxWidth: '90%', margin: '0 auto' }}>
      {post && (
        <div>
          <h1 className="text-2xl font-bold text-center mb-4">{post.title}</h1>
          <div className="mb-4">
            <ReactMarkdown
              className="prose max-w-none"
              components={{
                img: ({ node, ...props }) => (
                  <div className="d-flex justify-content-center">
                    <img
                      {...props}
                      className="img-fluid"
                      style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain' }}
                    />
                  </div>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
            {post.createdAt && (
              <p className="text-sm text-gray-500 mt-4">
                Posted on: {new Date(post.createdAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="d-flex justify-content-center mt-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary px-4"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;