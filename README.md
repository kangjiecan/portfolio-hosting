# AWS Full-Stack Portfolio Project

A production-ready AWS cloud application featuring serverless backend, secure authentication, and scalable frontend deployment.

## Features

- User authentication with AWS Cognito
- Serverless backend using AWS SAM and Lambda
- Scalable frontend hosted on EC2 with ALB
- Media content delivery through CloudFront and S3
- DNS management with Route 53
- Local development environment with Docker

## Tech Stack

- **Frontend**: EC2, Application Load Balancer
- **Backend**: AWS SAM, Lambda (JavaScript)
- **Database**: DynamoDB
- **Authentication**: AWS Cognito
- **CDN**: CloudFront
- **Storage**: S3
- **DNS**: Route 53
- **Development**: Docker, SAM CLI

## Architecture

### Frontend
- EC2 hosted application
- Load balanced through ALB
- Integrated Cognito login/signup flow
- Environment configuration via `.env`
- Token management and session handling

### Backend
- Serverless architecture with AWS SAM
- Lambda functions in JavaScript
- AWS SDK integration
- Protected API endpoints
- Local development with Docker

### Infrastructure
- High-availability design
- CDN for content delivery
- S3 for media storage
- Route 53 for DNS management

## Getting Started

### Prerequisites
- AWS Account
- Docker
- Node.js
- AWS SAM CLI

### Local Development
1. Clone the repository
```bash
git clone https://github.com/kangjiecan/portfolio-hosting.git
```

2. Set up local environment
```bash
# Start DynamoDB local
docker-compose up

# Install dependencies
npm install
```

3. Configure environment variables
```bash
cp .env-example .env
# Edit .env with your configurations
```

4. Run locally
```bash
# Start backend
sam local start-api

# Start frontend
npm run dev
```

## Deployment

### Backend Deployment
```bash
sam deploy
```

### Frontend Deployment
1. Build the application
2. Deploy to EC2 instances
3. Configure ALB and target groups

## Infrastructure Setup

### AWS Services Configuration
- Set up Cognito User Pool
- Configure S3 buckets
- Set up CloudFront distribution
- Configure Route 53 DNS records
- Set up EC2 instances and ALB

## License

Free to use

## Contributing

Feel free to submit issues and pull requests.

## Contact

Project Link: [https://github.com/kangjiecan/portfolio-hosting.git](https://github.com/kangjiecan/portfolio-hosting.git)
