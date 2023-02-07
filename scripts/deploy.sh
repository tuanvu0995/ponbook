#!/bin/sh

echo "Start to deploy...\n"
echo "SCP build source"
rsync -avzhe ssh ${PWD}/build/ vu@45.32.121.133:./app
echo "Install dependencies"
ssh vu@45.32.121.133 ./deploy.sh