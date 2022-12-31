#!/bin/bash
echo "Pull new code from git"
git pull
echo "Build new image"
docker build -t tuanvu0995/ponbook .
echo "Docker compose down"
docker-compose down
echo "Docker compose up"
docker-compose up -d