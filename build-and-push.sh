#!/bin/bash

# Build and Push Script for AI Mock Interview App
# Usage: ./build-and-push.sh [tag] [dockerhub-username]

set -e

# Default values
TAG=${1:-latest}
DOCKERHUB_USERNAME=${2:-your-dockerhub-username}
IMAGE_NAME="ai-mock-interview"
FULL_IMAGE_NAME="$DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG"

echo "🚀 Building Docker image: $FULL_IMAGE_NAME"

# Build the Docker image
docker build -t $FULL_IMAGE_NAME .

echo "✅ Docker image built successfully!"

# Ask for confirmation before pushing
read -p "Do you want to push the image to Docker Hub? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Pushing image to Docker Hub..."
    
    # Login to Docker Hub (if not already logged in)
    echo "Please make sure you're logged in to Docker Hub"
    docker login
    
    # Push the image
    docker push $FULL_IMAGE_NAME
    
    echo "✅ Image pushed successfully!"
    echo "🔗 Your image is available at: https://hub.docker.com/r/$DOCKERHUB_USERNAME/$IMAGE_NAME"
    echo "📋 To run the container:"
    echo "   docker run -p 3000:3000 --env-file .env.local $FULL_IMAGE_NAME"
else
    echo "❌ Push cancelled"
fi

echo "🎉 Build process completed!"