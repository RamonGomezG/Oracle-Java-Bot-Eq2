#!/bin/bash

export IMAGE_NAME=todolistapp-springboot
export IMAGE_VERSION=0.1


if [ -z "$DOCKER_REGISTRY" ]; then
    echo "DOCKER_REGISTRY not set. Will get it with state_get"
  export DOCKER_REGISTRY=$(state_get DOCKER_REGISTRY)
fi

if [ -z "$DOCKER_REGISTRY" ]; then
    echo "Error: DOCKER_REGISTRY env variable needs to be set!"
    exit 1
fi
export IMAGE=${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}

echo "pwd: $(pwd)"
echo "JAVA: $JAVA_HOME"
echo "jarfile: $(ls -la target)"
echo "mvn: $(mvn package)"
# echo "mvn: $(mvn clean package spring-boot:repackage)"


docker build -f Dockerfile -t $IMAGE --platform=linux/arm64 .


docker push $IMAGE
if [  $? -eq 0 ]; then
    docker rmi "$IMAGE"
fi