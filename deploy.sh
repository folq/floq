#!/bin/sh
docker build -t floq .
docker tag floq floq:latest blankoslo/floq:latest
docker push blankoslo/floq:latest