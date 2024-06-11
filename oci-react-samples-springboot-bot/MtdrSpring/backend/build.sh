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

echo "which mvn: $(which mvn)"
echo "pwd: $(pwd)"
echo "JAVA: $JAVA_HOME"
# echo "mvn: $(mvn package)"
echo "mvn: $(mvn clean package spring-boot:repackage)"
echo "jarfile: $(ls -la target)"


docker build -f Dockerfile -t $IMAGE --platform=linux/arm64/v8 .
#docker login
echo "Z_PqK.S}890emo3OA#)y" | docker login -u "ax46bshgejdj/a01235962@tec.mx" --password-stdin "mx-queretaro-1.ocir.io"

docker push $IMAGE
if [  $? -eq 0 ]; then
    docker rmi "$IMAGE"
fi