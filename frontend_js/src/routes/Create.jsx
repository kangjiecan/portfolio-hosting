import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

const CreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState('');

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: '',
    }
  });

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding JWT:', err);
      throw new Error('Invalid token format');
    }
  };

  useEffect(() => {
    try {
      const idToken = sessionStorage.getItem('idToken');
      if (idToken) {
        const decodedToken = decodeJWT(idToken);
        setUserData(decodedToken);
      }
    } catch (err) {
      console.error('Error getting user data from token:', err);
    }
  }, []);

  const getUserInfo = () => {
    const idToken = sessionStorage.getItem('idToken');
    if (!idToken) {
      throw new Error('No ID token found. Please login again.');
    }

    try {
      const decodedToken = decodeJWT(idToken);
      if (!decodedToken.sub && !decodedToken.userId) {
        throw new Error('User ID not found in token');
      }
      return decodedToken;
    } catch (err) {
      console.error('Error processing token:', err);
      throw new Error('Unable to get user information. Please log in again.');
    }
  };

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const onSubmit = async (data) => {
    if (!content || content.length < 10) {
      setError('Content must be at least 10 characters.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const userInfo = getUserInfo();
      const idToken = sessionStorage.getItem('idToken');

      const postData = {
        title: data.title,
        content: content,
        userID: userInfo.sub || userInfo.userId,
        postID: `po${Math.random().toString(36).substring(2)}${Date.now()}`
      };

      const response = await fetch('https://nf04st3ar4.execute-api.ca-central-1.amazonaws.com/Stage/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to create post');
      }

      setSuccess(true);
      reset();
      setContent('');
    } catch (err) {
      setError(err.message);
      if (err.message.includes('token')) {
        sessionStorage.removeItem('idToken');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
        
        {userData && (
          <p className="text-sm text-gray-600 mb-4">
            Posting as: {userData.email || userData.nickname || 'Anonymous'}
          </p>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Post Title"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("title", { 
                required: "Title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" }
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <MdEditor
              value={content}
              style={{ height: '800px', width: '100%' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded">
              Post created successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Post...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;