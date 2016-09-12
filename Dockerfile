FROM mhart/alpine-node

RUN mkdir -p /floq
WORKDIR /floq
COPY src /floq/src
COPY package.json /floq/
RUN apk add --no-cache git
RUN npm install

ENV PORT=80
EXPOSE 80
CMD [ "npm", "start" ]
