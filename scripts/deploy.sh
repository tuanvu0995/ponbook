#!/bin/sh

echo "Start to deploy...\n"
echo "SCP build source"
rsync -avzhe ssh ${PWD}/build/ vu@ponbook.net:./app
echo "Install dependencies"
ssh vu@ponbook.net ./deploy.sh