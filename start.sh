#!/bin/sh
mkdir "${PWD}/config"
cp -v /etc/floq-secret/apps.json "${PWD}/config/apps.json"
npm start
