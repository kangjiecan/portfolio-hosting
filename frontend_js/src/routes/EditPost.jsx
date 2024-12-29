import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const EditPost = () => {
  const { postID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [postID]);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_RETERIEVE_POST_BY_POSTID}${postID}`
      );
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError('Error fetching post');
      console.error(err);
    }
  };

  const handleEditorChange = ({ text }) => {
    setPost(prev => ({
      ...prev,
      content: text
    }));
  };

  const handleTitleChange = (e) => {
    setPost(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    const idToken = sessionStorage.getItem('idToken');
    if (!idToken) {
      setError('Authentication token not found');
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_DELETE_POST_BY_POSTID.replace('{postID}', postID),
        {
          method: 'DELETE',
          headers: {
            'Authorization': idToken
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to delete post');
      navigate(-1);
    } catch (err) {
      setError('Error deleting post');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idToken = sessionStorage.getItem('idToken');
    if (!idToken) {
      setError('Authentication token not found');
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_EDIT_POST_BY_POSTID.replace('{postID}', postID),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': idToken
          },
          body: JSON.stringify({
            postID: postID,
            userId: userId,
            title: post.title,
            content: post.content,
            date: new Date().toISOString()
          })
        }
      );
      
      if (!response.ok) throw new Error('Failed to update post');
      navigate(-1);
    } catch (err) {
      setError('Error updating post');
      console.error(err);
    }
  };

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (!post) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={post.title}
            onChange={handleTitleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <MarkdownEditor
            value={post.content}
            onChange={handleEditorChange}
            style={{ height: '400px' }}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;