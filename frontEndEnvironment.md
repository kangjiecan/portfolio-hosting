# Environment Setup Guide

## Setup Instructions

1. Create a `.env` file in the frontend root directory
2. Add the following variables with your own values

```env
# Local Development
VITE_APP_HOST=                   # Your local development URL (e.g., http://localhost:5173)

# Cognito Configuration
VITE_COGNITO_DOMAIN=            # Your Cognito domain URL
VITE_COGNITO_CLIENT_ID=         # Your Cognito app client ID
VITE_COGNITOPOOLID=             # Your Cognito user pool ID
VITE_COGNITO_IDENTITYPOOLID=    # Your Cognito identity pool ID
VITE_ISSUER=                    # Your Cognito issuer URL

# Authentication URLs
VITE_REDIRECT_URI=              # Your OAuth redirect URL
VITE_LOGOUT_URL=                # Your logout redirect URL

# AWS Configuration
VITE_AWS_REGION=                # Your AWS region

# API Endpoints
# Replace [YOUR_API_ENDPOINT] with your API Gateway endpoint
VITE_API_JWTEXCHANGE=           # Your token exchange endpoint
VITE_API_CREATEPOST=            # Your create post endpoint
VITE_RETRIEVE_POST_BY_USERID=   # Your retrieve posts endpoint
VITE_PHOTO_POST=                # Your photo upload endpoint
VITE_RETRIEVE_PHOTO_BY_USERID=  # Your photo retrieval endpoint
VITE_DELETE_PHOTO_BY_ID=        # Your photo deletion endpoint
VITE_RETRIEVE_PHOTO_BY_MEDIAID= # Your single photo retrieval endpoint
VITE_RETERIEVE_POST_BY_POSTID=  # Your single post retrieval endpoint
VITE_DELETE_POST_BY_POSTID=     # Your post deletion endpoint
VITE_EDIT_POST_BY_POSTID=       # Your post edit endpoint
```

## Where to Find These Values

### Cognito Configuration
1. Go to AWS Cognito Console
2. Select your User Pool
3. Copy the following:
   - User Pool ID for `VITE_COGNITOPOOLID`
   - Domain name for `VITE_COGNITO_DOMAIN`
   - App client ID from "App integration" tab for `VITE_COGNITO_CLIENT_ID`
   - Identity Pool ID for `VITE_COGNITO_IDENTITYPOOLID`

### API Endpoints
1. Go to API Gateway Console
2. Select your API
3. Find the Stage URL for each endpoint
4. Replace the paths according to your API configuration

### Local Development
- Set `VITE_APP_HOST` to your local development server (typically http://localhost:5173)
- Set redirect URIs to match your local or deployed frontend URLs

## Important Notes

1. Keep this file secure - never commit it to version control
2. Ensure all URLs use the correct protocol (http/https)
3. Make sure redirect URIs are configured in Cognito
4. API endpoints should include the full path including stage name (e.g., /Stage/post)

## Validation

After setting up, verify:
1. Local development server can start
2. Authentication flow works
3. API endpoints are accessible
4. Media upload/download functions correctly
