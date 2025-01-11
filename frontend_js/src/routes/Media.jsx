import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const configureS3Client = async (idToken) => {
  const cognitoIdentityClient = new CognitoIdentityClient({
    region: import.meta.env.VITE_AWS_REGION
  });

  const credentials = fromCognitoIdentityPool({
    client: cognitoIdentityClient,
    identityPoolId: import.meta.env.VITE_COGNITO_IDENTITYPOOLID,
    logins: {
      [import.meta.env.VITE_ISSUER]: idToken
    }
  });

  return new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials
  });
};

const getUserIdFromToken = (idToken) => {
  try {
    const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
    return decodedToken.sub;
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

const uploadFileToS3 = async (file, idToken) => {
  if (!file) throw new Error('No file selected');
  
  const userId = getUserIdFromToken(idToken);
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const key = `uploads/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
  
  const s3Client = await configureS3Client(idToken);
  const command = new PutObjectCommand({
    Bucket: 'media-host',
    Key: key,
    Body: file,
    ContentType: file.type
  });

  await s3Client.send(command);
  return `https://media-host.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
};

const deleteFileFromS3 = async (s3Url, idToken) => {
  const s3Key = s3Url.split('.amazonaws.com/')[1];
  if (!s3Key) throw new Error('Invalid S3 URL format');

  const s3Client = await configureS3Client(idToken);
  const deleteCommand = new DeleteObjectCommand({
    Bucket: 'media-host',
    Key: s3Key
  });

  await s3Client.send(deleteCommand);
};

const uploadMediaRecord = async (url, userId, idToken) => {
  const payload = {
    mediaID: `photo_${Date.now()}`,
    userID: userId,
    url: url,
    createdAt: new Date().toISOString()
  };

  const response = await fetch(import.meta.env.VITE_PHOTO_POST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create media record');
  }

  return response.json();
};

const getMediaByUserId = async (userId) => {
  const response = await fetch(`${import.meta.env.VITE_RETRIEVE_PHOTO_BY_USERID}${userId}`, {
    headers: { 'origin': window.location.origin }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to retrieve media');
  }

  return response.json();
};

const deleteMediaRecord = async (mediaId, idToken) => {
  const response = await fetch(
    import.meta.env.VITE_DELETE_PHOTO_BY_ID.replace('{mediaID}', mediaId),
    {
      method: 'DELETE',
      headers: { 'Authorization': idToken }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete media record');
  }

  return response.json();
};

const MediaOperations = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const fileInputRef = useRef(null);

  

  const loadUserMedia = async () => {
    try {
      const idToken = sessionStorage.getItem('idToken');
      if (!idToken) throw new Error('Authentication token not found');
      
      const userId = getUserIdFromToken(idToken);
      const response = await getMediaByUserId(userId);
      setMediaItems(response);
    } catch (error) {
      console.error('Error loading media:', error);
      setStatus({
        message: error.message,
        type: 'error'
      });
    }
  };

  useEffect(() => {
    loadUserMedia();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const confirmDelete = (media) => {
    setMediaToDelete(media);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const idToken = sessionStorage.getItem('idToken');
      if (!idToken) throw new Error('Authentication token not found');

      if (!mediaToDelete) return;
      
      await deleteFileFromS3(mediaToDelete.url, idToken);
      await deleteMediaRecord(mediaToDelete.mediaID, idToken);
      
      setMediaItems(prevItems => prevItems.filter(item => item.mediaID !== mediaToDelete.mediaID));
      setMediaToDelete(null);
      setStatus({
        message: 'Media deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Delete error:', error);
      setStatus({
        message: error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const idToken = sessionStorage.getItem('idToken');
      if (!idToken) throw new Error('Authentication token not found');

      const userId = getUserIdFromToken(idToken);
      const s3Url = await uploadFileToS3(selectedFile, idToken);
      const response = await uploadMediaRecord(s3Url, userId, idToken);
      
      setMediaItems(prevItems => [...prevItems, { ...response, url: s3Url }]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setStatus({
        message: 'Upload successful',
        type: 'success'
      });
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({
        message: error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Upload Section */}
      <div className="card mb-4">
        <div className="card-header">
          Upload Media
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="input-group">
                <input
                  type="file"
                  className="form-control"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button
                  className={`btn btn-primary ${isLoading || !selectedFile ? 'disabled' : ''}`}
                  onClick={handleUpload}
                  disabled={isLoading || !selectedFile}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  Upload
                </button>
              </div>
            </div>
          </div>
          
          {status.message && (
            <div className={`alert alert-${status.type === 'error' ? 'danger' : 'success'} mt-3`} role="alert">
              {status.message}
            </div>
          )}
        </div>
      </div>

      {/* Media Grid */}
      <div className="card">
        <div className="card-header">
          Media Gallery
        </div>
        <div className="card-body">
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-2">
            {mediaItems.map((media) => (
              <div key={media.mediaID} className="col">
                <div className="card h-100" style={{ cursor: 'pointer' }}>
                  <img 
                    src={media.url} 
                    className="card-img-top"
                    alt="Media thumbnail" 
                    style={{ height: '100px', objectFit: 'cover' }}
                    onClick={() => window.open(media.url, '_blank')}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                      e.target.onerror = null;
                    }}
                  />
                  <div className="card-body p-2">
                    <small className="text-muted d-block mb-2">
                      {new Date(media.createdAt).toLocaleString()}
                    </small>
                    <button
                      className="btn btn-secondary btn-sm w-100 mb-2"
                      onClick={() => {
                        navigator.clipboard.writeText(media.url);
                        setStatus({
                          message: 'URL copied to clipboard',
                          type: 'success'
                        });
                      }}
                    >
                      Copy URL
                    </button>
                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => confirmDelete(media)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mediaItems.length === 0 && !isLoading && (
            <div className="text-center text-muted py-4">
              No media items found. Upload some images to get started.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${mediaToDelete ? 'show' : ''}`} 
           style={{ display: mediaToDelete ? 'block' : 'none' }}
           tabIndex="-1"
           aria-hidden={!mediaToDelete}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setMediaToDelete(null)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this media? This action cannot be undone.</p>
              {mediaToDelete && (
                <img 
                  src={mediaToDelete.url} 
                  alt="To be deleted" 
                  className="img-thumbnail mb-2" 
                  style={{ maxHeight: '200px', width: 'auto', display: 'block', margin: '0 auto' }}
                />
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setMediaToDelete(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrop */}
      {mediaToDelete && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default MediaOperations;