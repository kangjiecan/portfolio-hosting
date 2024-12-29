# Full-Stack AWS Project

This project is a full-stack application built with AWS services, featuring a JavaScript backend using SAM (Serverless Application Model), a frontend application, and a local DynamoDB testing environment.

## Project Structure

The project consists of three main components:
- Frontend Application
- Backend (SAM-based Lambda functions)
- Local DynamoDB Test Environment

## Backend

The backend is built using AWS SAM (Serverless Application Model) and includes:
- Lambda functions written in JavaScript
- AWS SDK integration
- Infrastructure as Code using SAM template

Note: While the project started with SAM template deployment, CloudFront and DNS configurations were manually deployed through the AWS Console. You can find an example of the template in `template-example`.

## Frontend

The frontend application requires specific environment variables for configuration. You can find:
- Complete environment variable documentation in the environment docs
- Example configuration in `.env-example` located in the frontend root directory

To set up the frontend:
1. Copy `.env-example` to `.env`
2. Configure the environment variables according to your setup
3. Follow the environment documentation for additional configuration steps

## Local Development Environment

### DynamoDB Local Testing
The project includes a Docker configuration for local DynamoDB testing. This allows you to:
- Test DynamoDB operations locally
- Develop without connecting to AWS services
- Simulate the production database environment

### Setup Requirements
- Docker and Docker Compose
- AWS SAM CLI
- Node.js and npm/yarn

## Deployment

### Backend Deployment
- Backend components are deployed using SAM CLI
- CloudFront and DNS are managed through AWS Console

### Frontend Deployment
The frontend application is deployed on EC2 instances behind an Application Load Balancer (ALB).

#### Infrastructure Setup
1. EC2 Instances
   - Instance type recommendation based on your traffic needs
   - Use of Auto Scaling Group recommended for high availability
   - Configure security groups to allow traffic from ALB

2. Application Load Balancer (ALB)
   - Distributes traffic across EC2 instances
   - SSL/TLS termination at ALB level
   - Health checks configuration for instance monitoring

#### Deployment Steps
1. Configure environment variables
2. Build the frontend application
3. Deploy to EC2 instances
   - Set up Node.js environment on EC2
   - Configure process manager (e.g., PM2)
   - Set up reverse proxy (e.g., Nginx)
4. Configure ALB
   - Set up target groups
   - Configure listeners
   - Set up routing rules

## Infrastructure

### AWS Services
The application uses the following AWS services:
- Lambda for serverless functions
- DynamoDB for database
- CloudFront for content delivery
- Route 53 for DNS management
- EC2 for hosting frontend application
- Application Load Balancer (ALB) for traffic distribution
- S3 for media storage

### DNS Management (Route 53)
- Domain registration and management through Route 53
- DNS record configuration:
  - A records for ALB
  - CNAME records for CloudFront distribution
  - Alias records for AWS resources
- Health checks and DNS failover configuration
- Multi-region DNS routing (if applicable)

### Media Storage (S3)
- Dedicated S3 bucket for media files
- Bucket configuration:
  - Public access settings
  - CORS configuration
  - Lifecycle policies
- Integration with CloudFront for content delivery
- Access control using IAM roles and policies

## License

This project is free to use. Feel free to modify and distribute according to your needs.

## Getting Started

1. Clone the repository
2. Set up the local DynamoDB environment using Docker
3. Configure frontend environment variables
4. Deploy backend using SAM
5. Deploy frontend to your hosting service

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any improvements or bug fixes.
