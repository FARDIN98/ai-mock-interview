# 🐳 Docker Setup Guide for AI Mock Interview App

This guide will show you the complete process of running the AI Mock Interview application with Docker.

## 📋 Prerequisites

- Docker Desktop installed on your machine
- Docker Hub account (for publishing)
- Git (for cloning the repository)

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the .env.local file with your actual values
nano .env.local
```

### 2. Build and Run with Docker Compose

```bash
# Build and run the production version
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# For development version
docker-compose --profile dev up --build
```

### 3. Access the Application

- Production: http://localhost:3000
- Development: http://localhost:3001

## 🔧 Manual Docker Commands

### Build the Image

```bash
# Build production image
docker build -t ai-mock-interview .

# Build development image
docker build -f Dockerfile.dev -t ai-mock-interview:dev .
```

### Run the Container

```bash
# Run production container
docker run -p 3000:3000 --env-file .env.local ai-mock-interview

# Run development container
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules --env-file .env.local ai-mock-interview:dev
```

## 📤 Publishing to Docker Hub

### Method 1: Using the Build Script

```bash
# Make the script executable (already done)
chmod +x build-and-push.sh

# Run the script
./build-and-push.sh latest your-dockerhub-username
```

### Method 2: Manual Commands

```bash
# Login to Docker Hub
docker login

# Tag your image
docker tag ai-mock-interview your-dockerhub-username/ai-mock-interview:latest

# Push to Docker Hub
docker push your-dockerhub-username/ai-mock-interview:latest
```

## 🔐 Environment Variables

The following environment variables are required:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_VAPI_WEB_TOKEN` | VAPI web token | ✅ |
| `NEXT_PUBLIC_VAPI_WORKFLOW_ID` | VAPI workflow ID | ✅ |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | ✅ |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `FIREBASE_PROJECT_ID` | Firebase project ID (admin) | ✅ |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | ✅ |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | ✅ |

## 🛠️ Development Workflow

### Local Development with Docker

```bash
# Start development environment
docker-compose --profile dev up

# View logs
docker-compose logs -f ai-mock-interview-dev

# Stop development environment
docker-compose --profile dev down
```

### Production Testing

```bash
# Build and test production image locally
docker-compose up --build

# Test the application
curl http://localhost:3000
```

## 📊 Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# Remove containers
docker rm container_name

# Remove images
docker rmi image_name

# View container logs
docker logs container_name

# Execute commands in running container
docker exec -it container_name sh

# Clean up unused resources
docker system prune
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 PID
   ```

2. **Environment variables not loading**
   - Make sure `.env.local` file exists
   - Check file permissions
   - Verify variable names match exactly

3. **Build failures**
   ```bash
   # Clean Docker cache
   docker builder prune
   
   # Rebuild without cache
   docker build --no-cache -t ai-mock-interview .
   ```

4. **Container won't start**
   ```bash
   # Check container logs
   docker logs container_name
   
   # Run container interactively
   docker run -it ai-mock-interview sh
   ```

## 🚀 Deployment Options

### 1. Docker Hub + Cloud Platforms

```bash
# After pushing to Docker Hub, deploy to:
# - AWS ECS
# - Google Cloud Run
# - Azure Container Instances
# - DigitalOcean App Platform
```

### 2. Direct Deployment

```bash
# On your server
docker pull your-dockerhub-username/ai-mock-interview:latest
docker run -d -p 80:3000 --env-file .env.local your-dockerhub-username/ai-mock-interview:latest
```

## 📝 Notes

- The production Dockerfile uses multi-stage builds for optimization
- Next.js standalone output is enabled for smaller container size
- Development Dockerfile includes hot reloading
- All sensitive data should be in environment variables, not in the image

## 🤝 Contributing

If you find any issues with the Docker setup, please create an issue or submit a pull request.

---

**Happy Dockerizing! 🐳**