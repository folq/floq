FROM mhart/alpine-node
ARG env=dev

RUN mkdir -p /floq
WORKDIR /floq
COPY src/apps.json.${env} /floq/src/apps.json
COPY src /floq/src
COPY package.json /floq/
RUN apk add --no-cache git
RUN npm install

ENV PORT=80
EXPOSE 80
CMD [ "npm", "start" ]
