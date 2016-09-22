FROM mhart/alpine-node

# Required ENV variables:
# - API_TOKEN_SECRET (secret shared with floq-api)
# - FLOQ_ACCEPTED_EMAIL_DOMAIN (e.g. 'blankoslo.no')

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
