# Project Structure and Deployment Guide

## Project Overview

```
.
├── backend/           # Backend services
├── frontend_js/       # React frontend application
```

## Local Development Setup

### 1. DynamoDB Local (`backend/docker/`)
Local DynamoDB setup for development and testing.

```bash
cd backend/docker/dynamodb
docker-compose up -d
```

Key files:
- `docker-compose.yml`: DynamoDB local container configuration
- `create-tables.sh`: Script to initialize DynamoDB tables
- `shared-local-instance.db`: Local DynamoDB data file

### 2. Frontend Development (`frontend_js/`)
React application with Vite and Tailwind CSS.

Key components:
- `src/routes/`: React components for different pages
- `src/ui/`: Reusable UI components
- `deploy.sh`: S3 deployment script

Deploy to S3:
```bash
cd frontend_js
chmod +x deploy.sh
./deploy.sh
```

### 3. Backend Deployment (`backend/sam-app/`)
SAM template for AWS Lambda functions deployment.

#### Lambda Functions (`src/handlers/`)
- `exchangeJWT.mjs`: Token exchange handler
- `get-items.mjs`: Item retrieval handler
- `post-items.mjs`: Item creation handler

Deploy using SAM:
```bash
cd backend/sam-app
sam build
sam deploy --guided  # First time
sam deploy          # Subsequent deployments
```

## Directory Structure Explained

### Backend Structure
```
backend/
├── docker/                  # Local development setup
├── s3-template/            # S3 bucket configuration
└── sam-app/                # Lambda functions and API
    ├── src/handlers/       # Lambda function handlers
    ├── events/            # Test events
    ├── template.yml       # SAM template
    └── env.json          # Environment variables
```

### Frontend Structure
```
frontend_js/
├── src/
│   ├── routes/           # Page components
│   └── ui/              # Shared UI components
├── dist/                # Build output
├── deploy.sh            # S3 deployment script
└── vite.config.js       # Vite configuration
```

## Deployment Processes

### 1. Frontend Deployment (S3)
The `deploy.sh` script:
1. Builds the React application
2. Syncs with S3 bucket
3. Invalidates CloudFront cache (if configured)

```bash
# deploy.sh example
npm run build
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 2. Backend Deployment (SAM)
The SAM template (`template.yml`) defines:
- Lambda functions
- API Gateway endpoints
- DynamoDB tables
- IAM roles and policies

Deploy process:
1. `sam build`: Package application
2. `sam deploy`: Deploy to AWS

### 3. Local Development
DynamoDB local setup:
1. Start Docker container
2. Run create-tables script
3. Use for local testing

```bash
# Start local DynamoDB
cd backend/docker/dynamodb
docker-compose up -d

# Create tables
./create-tables.sh
```

## Important Notes

1. **Local Development**:
   - Use DynamoDB local for development
   - Set up `.env` file in frontend
   - Configure AWS credentials

2. **Frontend Deployment**:
   - Update S3 bucket name in deploy.sh
   - Configure CloudFront if needed
   - Set correct API endpoints

3. **Backend Deployment**:
   - Update SAM template parameters
   - Configure environment variables
   - Set up proper IAM roles

4. **Security**:
   - Keep env.json and credentials secure
   - Use proper IAM roles
   - Configure CORS correctly
