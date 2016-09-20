FROM mhart/alpine-node
ARG env=dev

RUN mkdir -p /floq
WORKDIR /floq
COPY src /floq/src
COPY package.json /floq/
COPY start.sh /floq/
RUN apk add --no-cache git
RUN npm install

ENV PORT=3000
EXPOSE 3000

CMD [ "sh", "start.sh" ]
